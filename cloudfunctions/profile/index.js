/**
 * 云函数 profile —— 用户昵称 / 注销
 *
 * actions:
 *   get          读取自己的资料 → { ok, profile: { nickname } | null }
 *   setNickname  设置昵称（1–12 个字，去除 HTML）→ { ok, nickname }
 *   delete       删除自己的 profiles / progress / ratelimits 文档 → { ok }
 *
 * uid 只从调用上下文获取，不接受前端传入；匿名访客不可使用。
 * 集合：profiles（_id = uid）、progress（_id = uid）、ratelimits
 */
"use strict";

const tcb = require("@cloudbase/node-sdk");

const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV });
const db = app.database();

function getCaller() {
  try {
    const info = app.auth().getUserInfo() || {};
    return { uid: info.uid || "", isAnonymous: !!info.isAnonymous };
  } catch (e) {
    return { uid: "", isAnonymous: true };
  }
}

// 去掉 HTML 标签、危险字符、控制字符，压缩空白
function cleanNickname(s) {
  return String(s == null ? "" : s)
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"'`\\]/g, "")
    .replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028-\u202e\ufeff]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 按"字"计数（emoji 等算一个）
function charLen(s) {
  return Array.from(s).length;
}

async function getDoc(coll, id) {
  try {
    const res = await db.collection(coll).doc(id).get();
    return (res && res.data && res.data[0]) || null;
  } catch (e) {
    return null;
  }
}

exports.main = async (event) => {
  const action = event && event.action;
  const caller = getCaller();
  const uid = caller.uid;
  if (!uid || caller.isAnonymous) return { ok: false, error: "请先登录" };

  try {
    if (action === "get") {
      const doc = await getDoc("profiles", uid);
      return { ok: true, profile: doc ? { nickname: doc.nickname || "" } : null };
    }

    if (action === "setNickname") {
      const nickname = cleanNickname(event.nickname);
      const len = charLen(nickname);
      if (len < 1 || len > 12) return { ok: false, error: "昵称需为 1–12 个字" };

      const old = await getDoc("profiles", uid);
      await db.collection("profiles").doc(uid).set({
        uid,
        nickname,
        createdAt: (old && old.createdAt) || Date.now(),
        updatedAt: Date.now()
      });

      // 同步到进度文档，供排行榜显示（文档不存在时忽略）
      try {
        await db.collection("progress").doc(uid).update({ nickname });
      } catch (e) { /* 还没有进度文档，忽略 */ }

      return { ok: true, nickname };
    }

    if (action === "delete") {
      // 删除用户自己的数据；咨询记录（inquiries）属于业务往来记录，不在此删除，
      // 如用户要求删除，请站长在控制台手动处理。
      try { await db.collection("profiles").doc(uid).remove(); } catch (e) { /* 不存在则忽略 */ }
      try { await db.collection("progress").doc(uid).remove(); } catch (e) { /* 不存在则忽略 */ }
      try { await db.collection("ratelimits").where({ uid }).remove(); } catch (e) { /* 忽略 */ }
      return { ok: true };
    }

    return { ok: false, error: "未知操作" };
  } catch (e) {
    console.error("profile error:", e && e.message ? e.message : e);
    return { ok: false, error: "服务器繁忙，请稍后再试" };
  }
};
