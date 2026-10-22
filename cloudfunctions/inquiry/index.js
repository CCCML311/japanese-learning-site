/**
 * 云函数 inquiry —— 课程 / 口译咨询表单
 *
 * 入参：{ payload: { type: "course"|"interpret", name, contact, course?, field?, date?, message } }
 * 流程：校验与截断字段 → 频率限制（同一用户或同一 IP 每小时最多 3 次）
 *       → 写入 inquiries 集合 → 用 QQ 邮箱 SMTP 发送通知邮件
 *
 * 邮件配置只从环境变量读取（在云开发控制台 → 云函数 → inquiry → 函数配置 → 环境变量 中填写）：
 *   SMTP_USER  发件 QQ 邮箱地址，例如 12345@qq.com
 *   SMTP_PASS  QQ 邮箱「授权码」（不是 QQ 密码！）
 *   NOTIFY_TO  接收通知的邮箱
 * 任何情况下都不会把这些值写进日志或返回给前端。
 * 未配置时：照常保存，返回 ok:true 并附带 note。
 */
"use strict";

const crypto = require("crypto");
const tcb = require("@cloudbase/node-sdk");
const nodemailer = require("nodemailer");

const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV });
const db = app.database();
const _ = db.command;

const RATE_LIMIT = 3;                    // 每小时最多次数
const RATE_WINDOW_MS = 60 * 60 * 1000;   // 1 小时

// 字段长度上限
const LIMITS = { name: 30, contact: 60, course: 60, field: 60, date: 30, message: 1000 };

function getCaller() {
  try {
    const info = app.auth().getUserInfo() || {};
    return { uid: info.uid || "", isAnonymous: !!info.isAnonymous };
  } catch (e) {
    return { uid: "", isAnonymous: true };
  }
}

function getIP() {
  try {
    return app.auth().getClientIP() || "";
  } catch (e) {
    return "";
  }
}

// 只保存 IP 的哈希，不保存明文 IP
function hashIP(ip) {
  if (!ip) return "";
  const salt = process.env.TCB_ENV || process.env.SCF_NAMESPACE || "breeze";
  return crypto.createHash("sha256").update(salt + "|" + ip).digest("hex").slice(0, 32);
}

// 去 HTML、去控制字符（保留换行），截断
function clean(v, max, multiline) {
  let s = String(v == null ? "" : v)
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u200b-\u200f\u2028-\u202e\ufeff]/g, "");
  s = multiline ? s.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
  s = s.trim();
  const arr = Array.from(s);
  return arr.length > max ? arr.slice(0, max).join("") : s;
}

function validate(p) {
  p = p && typeof p === "object" ? p : {};
  if (p.type !== "course" && p.type !== "interpret") return { error: "咨询类型有误" };
  const data = {
    type: p.type,
    name: clean(p.name, LIMITS.name),
    contact: clean(p.contact, LIMITS.contact),
    date: clean(p.date, LIMITS.date),
    message: clean(p.message, LIMITS.message, true)
  };
  if (p.type === "course") data.course = clean(p.course, LIMITS.course);
  else data.field = clean(p.field, LIMITS.field);

  if (!data.name) return { error: "请填写称呼" };
  if (!data.contact || Array.from(data.contact).length < 3) return { error: "请填写有效的联系方式" };
  if (Array.from(data.message).length < 2) return { error: "请填写留言内容" };
  return { data };
}

async function countRecent(key, since) {
  const res = await db.collection("ratelimits").where({ key, ts: _.gt(since) }).count();
  return (res && res.total) || 0;
}

async function sendMail(record) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.NOTIFY_TO;
  if (!user || !pass || !to) return { sent: false, note: "未配置邮件环境变量，已保存但未发送通知" };

  const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true, // SSL
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000
  });

  const typeText = record.type === "course" ? "课程咨询" : "口译咨询";
  const lines = [
    "类型：" + typeText,
    "称呼：" + record.name,
    "联系方式：" + record.contact,
    record.type === "course" ? "意向课程：" + (record.course || "-") : "口译领域：" + (record.field || "-"),
    "期望日期：" + (record.date || "-"),
    "",
    "留言：",
    record.message,
    "",
    "提交时间：" + new Date(record.createdAt + 8 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 19) + "（北京时间）",
    "记录 ID：" + (record._id || "-"),
    "",
    "—— 来自 日语学习站 · あお老师"
  ];

  // 使用纯文本邮件，避免 HTML 注入
  await transporter.sendMail({
    from: { name: "あお老师网站", address: user },
    to,
    subject: "【新" + typeText + "】" + record.name,
    text: lines.join("\n")
  });
  return { sent: true };
}

exports.main = async (event) => {
  try {
    const caller = getCaller();
    if (!caller.uid) return { ok: false, error: "请刷新页面后重试" };

    const v = validate(event && event.payload);
    if (v.error) return { ok: false, error: v.error };

    // ---- 频率限制 ----
    const now = Date.now();
    const since = now - RATE_WINDOW_MS;
    const uidKey = "inq:uid:" + caller.uid;
    const ipHash = hashIP(getIP());
    const ipKey = ipHash ? "inq:ip:" + ipHash : "";

    const [uidCount, ipCount] = await Promise.all([
      countRecent(uidKey, since),
      ipKey ? countRecent(ipKey, since) : Promise.resolve(0)
    ]);
    if (uidCount >= RATE_LIMIT || ipCount >= RATE_LIMIT) {
      return { ok: false, error: "提交太频繁，请一小时后再试" };
    }

    const rl = db.collection("ratelimits");
    await rl.add({ key: uidKey, uid: caller.uid, ts: now });
    if (ipKey) await rl.add({ key: ipKey, ts: now });

    // 顺手清理 1 天前的限流记录（失败不影响主流程）
    rl.where({ ts: _.lt(now - 24 * 3600 * 1000) }).remove().catch(() => {});

    // ---- 保存 ----
    const record = Object.assign({}, v.data, {
      uid: caller.uid,
      isAnonymous: caller.isAnonymous,
      status: "new",
      createdAt: now
    });
    const addRes = await db.collection("inquiries").add(record);
    record._id = addRes && (addRes.id || addRes._id);

    // ---- 邮件通知（失败不影响"提交成功"）----
    let mail = { sent: false };
    try {
      mail = await sendMail(record);
    } catch (e) {
      // 只记录错误类型，不输出任何账号信息
      console.error("mail send failed:", e && (e.code || e.responseCode || "unknown"));
      mail = { sent: false, note: "已保存，但通知邮件发送失败" };
    }

    const res = { ok: true, mailed: !!mail.sent };
    if (mail.note) res.note = mail.note;
    return res;
  } catch (e) {
    console.error("inquiry error:", e && e.message ? e.message : e);
    return { ok: false, error: "服务器繁忙，请稍后再试" };
  }
};
