/**
 * 云函数 progress —— 学习进度同步 + 周排行榜
 *
 * 调用方式（前端 js/api.js）：
 *   app.callFunction({ name: "progress", data: { action: "get" } })
 *   app.callFunction({ name: "progress", data: { action: "save", progress: {...} } })
 *   app.callFunction({ name: "progress", data: { action: "leaderboard", weekKey: "2026-W42" } })
 *
 * 安全要点：
 *   - uid 一律从调用上下文取得（auth.getUserInfo()），绝不信任前端传入的 uid
 *   - 服务端重新做合并与校验，并限制每次保存最多增加 500 经验，防止刷分
 *   - 排行榜只返回 nickname + weekXp
 *
 * 集合：progress（文档 _id = uid）、profiles（读取昵称）
 */
"use strict";

const tcb = require("@cloudbase/node-sdk");

const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV });
const db = app.database();
const _ = db.command;

const MAX_XP_GAIN_PER_SAVE = 500;   // 每次保存最多增加的经验值
const MAX_BEST_SCORE = 100000;      // 单项最佳成绩的合理上限
const CHECKIN_KEEP = 60;            // 只保留最近 60 个打卡日
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const WEEK_RE = /^\d{4}-W\d{2}$/;

// ---------------------------------------------------------------------------
// 时间工具：以北京时间（UTC+8）为准
// ---------------------------------------------------------------------------
function pad2(n) {
  return (n < 10 ? "0" : "") + n;
}

function bjNow() {
  // 返回一个 Date，其 UTC 字段等于北京时间
  return new Date(Date.now() + 8 * 3600 * 1000);
}

function bjToday() {
  const d = bjNow();
  return d.getUTCFullYear() + "-" + pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate());
}

function isoWeekKeyFromUTCFields(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return d.getUTCFullYear() + "-W" + pad2(week);
}

function currentWeekKey() {
  return isoWeekKeyFromUTCFields(bjNow());
}

function dayIndex(s) {
  const p = String(s).split("-");
  return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000);
}

// ---------------------------------------------------------------------------
// 进度规范化与合并（与前端 js/api.js 规则一致）
// ---------------------------------------------------------------------------
function num(v, max) {
  const n = Number(v);
  if (!isFinite(n) || n <= 0) return 0;
  return Math.min(Math.floor(n), max || Number.MAX_SAFE_INTEGER);
}

function validDate(s) {
  if (typeof s !== "string" || !DATE_RE.test(s)) return false;
  const idx = dayIndex(s);
  if (!isFinite(idx)) return false;
  const today = dayIndex(bjToday());
  // 允许 ±1 天的时区误差，拒绝未来日期和一年以前的日期
  return idx <= today + 1 && idx >= today - 400;
}

function normalize(p) {
  p = p && typeof p === "object" ? p : {};
  const best = p.best && typeof p.best === "object" ? p.best : {};
  let checkins = Array.isArray(p.checkins) ? p.checkins.filter(validDate) : [];
  checkins = Array.from(new Set(checkins)).sort().slice(-CHECKIN_KEEP);
  return {
    xp: num(p.xp),
    lastCheckin: validDate(p.lastCheckin) ? p.lastCheckin : null,
    checkins,
    best: { kanaQuiz: num(best.kanaQuiz, MAX_BEST_SCORE) },
    weekKey: typeof p.weekKey === "string" && WEEK_RE.test(p.weekKey) ? p.weekKey : currentWeekKey(),
    weekXp: num(p.weekXp),
    updatedAt: num(p.updatedAt)
  };
}

function computeStreak(checkins, today) {
  if (!checkins.length) return 0;
  const set = new Set(checkins.map(dayIndex));
  const t = dayIndex(today);
  let start = set.has(t) ? t : set.has(t - 1) ? t - 1 : null;
  if (start === null) return 0;
  let n = 0;
  while (set.has(start - n)) n++;
  return n;
}

/**
 * 服务端合并：stored 为数据库中已有数据（可信），client 为前端上传（不可信）
 */
function mergeServer(stored, client) {
  const cur = currentWeekKey();

  // 总经验：取较大值，但单次最多 +500
  const xp = Math.max(stored.xp, Math.min(client.xp, stored.xp + MAX_XP_GAIN_PER_SAVE));

  // 周经验：只认当前周；旧周数据视为 0
  const storedWeek = stored.weekKey === cur ? stored.weekXp : 0;
  const clientWeekRaw = client.weekKey === cur ? client.weekXp : 0;
  const clientWeek = Math.min(clientWeekRaw, storedWeek + MAX_XP_GAIN_PER_SAVE);
  const weekXp = Math.min(Math.max(storedWeek, clientWeek), xp);

  const checkins = Array.from(new Set(stored.checkins.concat(client.checkins)))
    .sort()
    .slice(-CHECKIN_KEEP);

  const lastCheckin = [stored.lastCheckin, client.lastCheckin, checkins[checkins.length - 1] || null]
    .filter(Boolean)
    .sort()
    .pop() || null;

  return {
    xp,
    streak: computeStreak(checkins, bjToday()),
    lastCheckin,
    checkins,
    best: { kanaQuiz: Math.max(stored.best.kanaQuiz, client.best.kanaQuiz) },
    weekKey: cur,
    weekXp,
    updatedAt: Date.now()
  };
}

// ---------------------------------------------------------------------------
// 工具
// ---------------------------------------------------------------------------
// 从调用上下文获取当前用户；匿名访客不允许保存进度
function getCaller() {
  try {
    const info = app.auth().getUserInfo() || {};
    return { uid: info.uid || "", isAnonymous: !!info.isAnonymous };
  } catch (e) {
    return { uid: "", isAnonymous: true };
  }
}

async function getDoc(coll, id) {
  try {
    const res = await db.collection(coll).doc(id).get();
    return (res && res.data && res.data[0]) || null;
  } catch (e) {
    return null;
  }
}

function toPublic(doc) {
  // 返回给前端的进度结构（去掉内部字段）
  const p = normalize(doc || {});
  return {
    xp: p.xp,
    streak: computeStreak(p.checkins, bjToday()),
    lastCheckin: p.lastCheckin,
    checkins: p.checkins,
    best: p.best,
    weekKey: p.weekKey === currentWeekKey() ? p.weekKey : currentWeekKey(),
    weekXp: p.weekKey === currentWeekKey() ? p.weekXp : 0,
    updatedAt: p.updatedAt
  };
}

// ---------------------------------------------------------------------------
// 入口
// ---------------------------------------------------------------------------
exports.main = async (event) => {
  const action = event && event.action;

  try {
    if (action === "leaderboard") {
      const weekKey = typeof event.weekKey === "string" && WEEK_RE.test(event.weekKey)
        ? event.weekKey
        : currentWeekKey();
      const res = await db.collection("progress")
        .where({ weekKey, weekXp: _.gt(0), nickname: _.exists(true) })
        .orderBy("weekXp", "desc")
        .limit(20)
        .field({ nickname: true, weekXp: true })
        .get();
      const list = (res.data || []).map((d) => ({
        nickname: String(d.nickname || "匿名").slice(0, 12),
        weekXp: num(d.weekXp)
      }));
      return { ok: true, weekKey, list };
    }

    const caller = getCaller();
    const uid = caller.uid;
    if (!uid || caller.isAnonymous) return { ok: false, error: "请先登录" };

    if (action === "get") {
      const doc = await getDoc("progress", uid);
      return { ok: true, progress: doc ? toPublic(doc) : null };
    }

    if (action === "save") {
      const client = normalize(event.progress);
      const storedDoc = await getDoc("progress", uid);
      const stored = normalize(storedDoc || { xp: 0, weekXp: 0, checkins: [], best: {} });
      const merged = mergeServer(stored, client);

      // 排行榜需要昵称：从 profiles 读取（没有昵称的用户不会上榜）
      const profile = await getDoc("profiles", uid);
      const nickname = profile && profile.nickname ? String(profile.nickname).slice(0, 12) : null;

      const data = Object.assign({}, merged, { uid });
      if (nickname) data.nickname = nickname;
      data.createdAt = (storedDoc && storedDoc.createdAt) || Date.now();

      await db.collection("progress").doc(uid).set(data);
      return { ok: true, progress: merged };
    }

    return { ok: false, error: "未知操作" };
  } catch (e) {
    console.error("progress error:", e && e.message ? e.message : e);
    return { ok: false, error: "服务器繁忙，请稍后再试" };
  }
};
