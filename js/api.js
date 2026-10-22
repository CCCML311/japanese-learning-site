/*
 * 日语学习站 · あお老师 —— 云端接口适配层（浏览器端）
 *
 * - 纯浏览器 JS，无需打包；依赖 js/config.js 先加载（window.BREEZE_CONFIG）。
 * - 对外只暴露 window.BreezeAPI，所有方法都不会向调用方抛异常。
 * - envId 为空时为离线/演示模式：不加载 SDK，各方法返回本地数据或 {ok:false}。
 *
 * 使用的 CloudBase JS SDK v2 能力（已对照 @cloudbase/js-sdk 2.28.x 源码核对）：
 *   cloudbase.init({ env, region })
 *   app.auth                       —— 既可当对象用，也可 app.auth() 调用，这里做了兼容
 *   auth.getSession()              —— 恢复登录态，返回 { data: { session, user }, error }
 *   auth.signInAnonymously()       —— 访客（匿名）登录，用于未登录访客调用云函数（如提交咨询）
 *   auth.signInWithOtp({ email })  —— 发送邮箱验证码；返回 data.verifyOtp({ token })
 *                                     用户不存在时自动注册，存在则直接登录
 *   auth.getVerification / auth.signInWithEmail —— 旧版邮箱验证码流程，作为兜底
 *   auth.signOut()
 *   app.callFunction({ name, data }) —— 调用云函数，返回 { result }
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // 内部状态
  // ---------------------------------------------------------------------------
  var state = {
    initPromise: null,
    online: false,
    app: null,
    auth: null,
    user: null,          // { uid, email, nickname }，仅邮箱登录用户；匿名访客为 null
    otpFlows: {},        // email -> { verify: function(code), sentAt: number }
    lastSendAt: {}       // email -> 时间戳，用于前端 60 秒发送间隔
  };

  var SEND_INTERVAL_MS = 60 * 1000;
  var SDK_LOAD_TIMEOUT_MS = 15000;
  var CALL_TIMEOUT_MS = 15000;
  var CHECKIN_KEEP = 60;

  function cfg() {
    return window.BREEZE_CONFIG || {};
  }

  // ---------------------------------------------------------------------------
  // 日期 / 周工具（使用用户设备本地时间）
  // ---------------------------------------------------------------------------
  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function dateStr(d) {
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function todayStr() {
    return dateStr(new Date());
  }

  // ISO 8601 周编号，例如 "2026-W42"
  function isoWeekKey(date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var day = d.getUTCDay() || 7;            // 周一=1 ... 周日=7
    d.setUTCDate(d.getUTCDate() + 4 - day);  // 移到本周周四
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return d.getUTCFullYear() + "-W" + pad2(week);
  }

  function currentWeekKey() {
    return isoWeekKey(new Date());
  }

  // "YYYY-MM-DD" -> 当天 UTC 零点的天序号，便于做差
  function dayIndex(s) {
    var p = String(s).split("-");
    return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000);
  }

  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  var WEEK_RE = /^\d{4}-W\d{2}$/;

  // ---------------------------------------------------------------------------
  // 进度：规范化 + 合并（与云函数 progress 中的规则保持一致）
  // ---------------------------------------------------------------------------
  function num(v) {
    var n = Number(v);
    return isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  function normalizeProgress(p) {
    p = p && typeof p === "object" ? p : {};
    var checkins = Array.isArray(p.checkins) ? p.checkins.filter(function (s) {
      return typeof s === "string" && DATE_RE.test(s);
    }) : [];
    var best = p.best && typeof p.best === "object" ? p.best : {};
    return {
      xp: num(p.xp),
      streak: num(p.streak),
      lastCheckin: typeof p.lastCheckin === "string" && DATE_RE.test(p.lastCheckin) ? p.lastCheckin : null,
      checkins: checkins,
      best: { kanaQuiz: num(best.kanaQuiz) },
      weekKey: typeof p.weekKey === "string" && WEEK_RE.test(p.weekKey) ? p.weekKey : currentWeekKey(),
      weekXp: num(p.weekXp),
      updatedAt: num(p.updatedAt)
    };
  }

  // 由打卡日期计算连续天数：从今天（或昨天）往前数连续的天数；断档则为 0
  function computeStreak(checkins, today) {
    if (!checkins.length) return 0;
    var set = {};
    checkins.forEach(function (s) { set[dayIndex(s)] = true; });
    var t = dayIndex(today || todayStr());
    var start = set[t] ? t : (set[t - 1] ? t - 1 : null);
    if (start === null) return 0;
    var n = 0;
    while (set[start - n]) n++;
    return n;
  }

  function mergeProgress(a, b) {
    a = normalizeProgress(a);
    b = normalizeProgress(b);

    // 打卡：并集、排序、只保留最近 60 天
    var seen = {};
    var all = a.checkins.concat(b.checkins).filter(function (s) {
      if (seen[s]) return false;
      seen[s] = true;
      return true;
    }).sort();
    var checkins = all.slice(-CHECKIN_KEEP);

    // 周经验：同一周取较大值；不同周取较新的那一周
    var weekKey, weekXp;
    if (a.weekKey === b.weekKey) {
      weekKey = a.weekKey;
      weekXp = Math.max(a.weekXp, b.weekXp);
    } else if (a.weekKey > b.weekKey) {
      weekKey = a.weekKey; weekXp = a.weekXp;
    } else {
      weekKey = b.weekKey; weekXp = b.weekXp;
    }
    // 已进入新的一周，旧周数据清零
    var cur = currentWeekKey();
    if (weekKey < cur) { weekKey = cur; weekXp = 0; }

    var lastCheckin = [a.lastCheckin, b.lastCheckin, checkins[checkins.length - 1] || null]
      .filter(Boolean).sort().pop() || null;

    return {
      xp: Math.max(a.xp, b.xp),
      streak: computeStreak(checkins),
      lastCheckin: lastCheckin,
      checkins: checkins,
      best: { kanaQuiz: Math.max(a.best.kanaQuiz, b.best.kanaQuiz) },
      weekKey: weekKey,
      weekXp: weekXp,
      updatedAt: Math.max(a.updatedAt, b.updatedAt, Date.now())
    };
  }

  // ---------------------------------------------------------------------------
  // 通用工具
  // ---------------------------------------------------------------------------
  function warn() {
    try {
      var args = Array.prototype.slice.call(arguments);
      args.unshift("[BreezeAPI]");
      console.warn.apply(console, args);
    } catch (e) { /* ignore */ }
  }

  function withTimeout(promise, ms, msg) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { reject(new Error(msg || "timeout")); }, ms);
      promise.then(function (v) { clearTimeout(timer); resolve(v); },
        function (e) { clearTimeout(timer); reject(e); });
    });
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (window.cloudbase && typeof window.cloudbase.init === "function") return resolve();
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("SDK 脚本加载失败")); };
      document.head.appendChild(s);
    });
  }

  // 兼容 app.auth（对象）与 app.auth()（函数）两种写法
  function getAuthObject(app) {
    var a = app.auth;
    if (a && typeof a.signInWithOtp === "function") return a;
    if (typeof a === "function") return a.call(app);
    return a;
  }

  var EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[A-Za-z]{2,}$/;

  function cleanNickname(s) {
    return String(s == null ? "" : s)
      .replace(/<[^>]*>/g, "")
      .replace(/[<>"'`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // 把 SDK 的 AuthError / 普通错误翻译成简短中文
  function authErrorText(err, fallback) {
    var raw = "";
    try {
      raw = ((err && (err.code || "")) + " " + (err && (err.message || err.error_description || err.error || "")) + " " +
        (err && err.category || "")).toLowerCase();
    } catch (e) { /* ignore */ }
    if (/network|failed to fetch|timeout|超时/.test(raw)) return "网络不稳定，请稍后重试";
    if (/rate|too many|frequen|limit|频繁/.test(raw)) return "操作太频繁，请稍后再试";
    if (/not.?enabled|provider|disabled|未开启/.test(raw)) return "邮箱登录暂未开启，请联系站长";
    if (/expire|过期/.test(raw)) return "验证码已过期，请重新获取";
    if (/verif|code|invalid|incorrect|captcha|验证码/.test(raw)) return "验证码错误或已失效";
    if (/email|邮箱/.test(raw)) return "邮箱地址有误或暂不支持";
    return fallback || "操作失败，请稍后重试";
  }

  // 调用云函数，返回云函数的 result；失败时抛错（仅在内部 try 中使用）
  function callFn(name, data) {
    if (!state.app) return Promise.reject(new Error("offline"));
    return withTimeout(state.app.callFunction({ name: name, data: data || {} }), CALL_TIMEOUT_MS, "timeout")
      .then(function (res) {
        var r = res && res.result;
        if (!r || typeof r !== "object") throw new Error("empty result");
        return r;
      });
  }

  async function getSessionUser() {
    if (!state.auth || typeof state.auth.getSession !== "function") return null;
    var res = await state.auth.getSession();
    var data = (res && res.data) || {};
    var session = data.session;
    if (!session) return null;
    return data.user || session.user || null;
  }

  // 确保有一个可用的登录态（邮箱用户或匿名访客），否则无法调用云函数
  async function ensureAnySession() {
    try {
      var u = await getSessionUser();
      if (u) return true;
    } catch (e) { /* ignore */ }
    try {
      if (typeof state.auth.signInAnonymously !== "function") return false;
      var r = await state.auth.signInAnonymously();
      if (r && r.error) {
        warn("匿名登录失败（请在控制台开启「匿名登录」）:", r.error.message || r.error);
        return false;
      }
      return true;
    } catch (e) {
      warn("匿名登录异常:", e);
      return false;
    }
  }

  // 有 email 的才算"已登录用户"；匿名访客没有 email
  function isRealUser(u) {
    return !!(u && u.id && u.email);
  }

  async function loadProfileNickname() {
    try {
      var r = await callFn("profile", { action: "get" });
      if (r.ok && r.profile && r.profile.nickname) return r.profile.nickname;
    } catch (e) {
      warn("读取昵称失败:", e);
    }
    return "";
  }

  // ---------------------------------------------------------------------------
  // 对外接口
  // ---------------------------------------------------------------------------
  async function doInit() {
    var c = cfg();
    if (!c.envId) {
      state.online = false;
      return { online: false };
    }
    try {
      await withTimeout(loadScript(c.sdkUrl), SDK_LOAD_TIMEOUT_MS, "SDK 加载超时");
      if (!window.cloudbase || typeof window.cloudbase.init !== "function") {
        throw new Error("未找到全局 cloudbase 对象");
      }
      state.app = window.cloudbase.init({ env: c.envId, region: c.region || "ap-shanghai" });
      state.auth = getAuthObject(state.app);
      if (!state.auth) throw new Error("auth 模块不可用");

      // 恢复登录态
      var u = null;
      try { u = await getSessionUser(); } catch (e) { warn("恢复登录态失败:", e); }

      state.online = true;

      if (isRealUser(u)) {
        var nick = await loadProfileNickname();
        state.user = { uid: u.id, email: u.email, nickname: nick || "" };
      } else if (!u) {
        // 没有任何登录态：以匿名访客身份登录，便于提交咨询、查看排行榜
        await ensureAnySession();
      }
      return { online: true };
    } catch (e) {
      warn("初始化失败，切换到离线模式:", e && e.message ? e.message : e);
      state.online = false;
      state.app = null;
      state.auth = null;
      state.user = null;
      return { online: false };
    }
  }

  function init() {
    if (!state.initPromise) {
      state.initPromise = doInit().catch(function (e) {
        warn("初始化异常:", e);
        state.online = false;
        return { online: false };
      });
    }
    return state.initPromise;
  }

  function isOnline() {
    return !!state.online;
  }

  function isLoggedIn() {
    return !!(state.online && state.user);
  }

  function getUser() {
    if (!state.user) return null;
    return { uid: state.user.uid, email: state.user.email, nickname: state.user.nickname };
  }

  async function sendCode(email) {
    try {
      email = String(email || "").trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return { ok: false, error: "请输入正确的邮箱地址" };
      if (!state.online || !state.auth) return { ok: false, error: "当前为离线模式，无法登录" };

      var last = state.lastSendAt[email] || 0;
      var wait = Math.ceil((SEND_INTERVAL_MS - (Date.now() - last)) / 1000);
      if (wait > 0) return { ok: false, error: "请 " + wait + " 秒后再获取验证码" };

      var auth = state.auth;
      var verify;

      if (typeof auth.signInWithOtp === "function") {
        // 新版接口：自动注册或登录
        var res = await auth.signInWithOtp({ email: email });
        if (res && res.error) return { ok: false, error: authErrorText(res.error, "验证码发送失败") };
        var fn = res && res.data && res.data.verifyOtp;
        if (typeof fn !== "function") return { ok: false, error: "验证码发送失败" };
        verify = function (code) { return fn({ token: code }); };
      } else if (typeof auth.getVerification === "function" && typeof auth.signInWithEmail === "function") {
        // 兜底：旧版 v2 流程
        var info = await auth.getVerification({ email: email });
        verify = async function (code) {
          await auth.signInWithEmail({ verificationInfo: info, verificationCode: code, email: email });
          return { data: { user: await getSessionUser() }, error: null };
        };
      } else {
        return { ok: false, error: "当前 SDK 不支持邮箱验证码登录" };
      }

      state.lastSendAt[email] = Date.now();
      state.otpFlows[email] = { verify: verify, sentAt: Date.now() };
      return { ok: true };
    } catch (e) {
      warn("sendCode 失败:", e);
      return { ok: false, error: authErrorText(e, "验证码发送失败") };
    }
  }

  async function verifyCode(email, code, nickname) {
    try {
      email = String(email || "").trim().toLowerCase();
      code = String(code || "").replace(/\s+/g, "");
      if (!EMAIL_RE.test(email)) return { ok: false, error: "请输入正确的邮箱地址" };
      if (!/^\d{4,8}$/.test(code)) return { ok: false, error: "请输入邮件中的数字验证码" };
      if (!state.online || !state.auth) return { ok: false, error: "当前为离线模式，无法登录" };

      var nick = cleanNickname(nickname);
      if (nickname != null && String(nickname).trim() !== "" && (nick.length < 1 || nick.length > 12)) {
        return { ok: false, error: "昵称需为 1–12 个字" };
      }
      if (nick.length > 12) return { ok: false, error: "昵称需为 1–12 个字" };

      var flow = state.otpFlows[email];
      if (!flow) return { ok: false, error: "请先获取验证码" };

      var res = await flow.verify(code);
      if (res && res.error) return { ok: false, error: authErrorText(res.error, "验证码错误或已失效") };

      var u = (res && res.data && res.data.user) || await getSessionUser();
      if (!u || !u.id) return { ok: false, error: "登录失败，请重试" };
      delete state.otpFlows[email];

      // 写入或读取昵称（存放在 profiles 集合，由云函数处理）
      var finalNick = "";
      try {
        if (nick) {
          var r1 = await callFn("profile", { action: "setNickname", nickname: nick });
          if (r1.ok) finalNick = r1.nickname || nick;
        } else {
          finalNick = await loadProfileNickname();
          if (!finalNick) {
            var def = cleanNickname(email.split("@")[0]).slice(0, 12) || "学习者";
            var r2 = await callFn("profile", { action: "setNickname", nickname: def });
            if (r2.ok) finalNick = r2.nickname || def;
          }
        }
      } catch (e) {
        warn("设置昵称失败:", e);
      }

      state.user = { uid: u.id, email: u.email || email, nickname: finalNick || nick || "" };
      return { ok: true, user: getUser() };
    } catch (e) {
      warn("verifyCode 失败:", e);
      return { ok: false, error: authErrorText(e, "验证码错误或已失效") };
    }
  }

  async function logout() {
    try {
      state.user = null;
      state.otpFlows = {};
      if (state.online && state.auth && typeof state.auth.signOut === "function") {
        await state.auth.signOut();
        // 退出后重新以匿名访客身份登录，保证咨询表单等仍可用
        await ensureAnySession();
      }
    } catch (e) {
      warn("logout 异常:", e);
    }
  }

  async function syncProgress(local) {
    var base;
    try {
      base = normalizeProgress(local);
    } catch (e) {
      return local;
    }
    if (!state.online || !state.user) return local;
    try {
      var r = await callFn("progress", { action: "save", progress: base });
      if (!r.ok || !r.progress) {
        warn("同步进度失败:", r.error);
        return local;
      }
      // 服务器有防刷上限，可能暂时小于本地；这里取两者合并结果展示，
      // 下次同步时服务器会继续追平（每次最多 +500 经验）。
      return mergeProgress(base, r.progress);
    } catch (e) {
      warn("syncProgress 异常:", e);
      return local;
    }
  }

  async function getLeaderboard() {
    if (!state.online) return [];
    try {
      if (!state.user) await ensureAnySession();
      var r = await callFn("progress", { action: "leaderboard", weekKey: currentWeekKey() });
      if (!r.ok || !Array.isArray(r.list)) return [];
      return r.list.slice(0, 20).map(function (x) {
        return { nickname: String(x.nickname || "匿名"), weekXp: num(x.weekXp) };
      });
    } catch (e) {
      warn("getLeaderboard 异常:", e);
      return [];
    }
  }

  async function submitInquiry(payload) {
    if (!state.online) return { ok: false, error: "demo" };
    try {
      payload = payload && typeof payload === "object" ? payload : {};
      if (payload.type !== "course" && payload.type !== "interpret") return { ok: false, error: "咨询类型有误" };
      if (!String(payload.name || "").trim()) return { ok: false, error: "请填写称呼" };
      if (!String(payload.contact || "").trim()) return { ok: false, error: "请填写联系方式" };
      if (!String(payload.message || "").trim()) return { ok: false, error: "请填写留言内容" };

      if (!state.user) {
        var ok = await ensureAnySession();
        if (!ok) return { ok: false, error: "暂时无法提交，请稍后再试" };
      }
      var r = await callFn("inquiry", {
        payload: {
          type: payload.type,
          name: payload.name,
          contact: payload.contact,
          course: payload.course,
          field: payload.field,
          date: payload.date,
          message: payload.message
        }
      });
      return r.ok ? { ok: true } : { ok: false, error: r.error || "提交失败，请稍后再试" };
    } catch (e) {
      warn("submitInquiry 异常:", e);
      return { ok: false, error: "网络不稳定，提交失败" };
    }
  }

  async function deleteAccount() {
    if (!state.online) return { ok: false, error: "当前为离线模式" };
    if (!state.user) return { ok: false, error: "请先登录" };
    try {
      var r = await callFn("profile", { action: "delete" });
      if (!r.ok) return { ok: false, error: r.error || "注销失败，请稍后再试" };
      // 说明：SDK 的 auth.deleteUser 需要账号密码，验证码登录的账号没有密码，
      // 因此登录身份本身需站长在控制台「身份认证 → 用户管理」中删除（数据已全部清除）。
      await logout();
      return { ok: true };
    } catch (e) {
      warn("deleteAccount 异常:", e);
      return { ok: false, error: "网络不稳定，注销失败" };
    }
  }

  window.BreezeAPI = {
    init: init,
    isOnline: isOnline,
    isLoggedIn: isLoggedIn,
    getUser: getUser,
    sendCode: sendCode,
    verifyCode: verifyCode,
    logout: logout,
    syncProgress: syncProgress,
    getLeaderboard: getLeaderboard,
    submitInquiry: submitInquiry,
    deleteAccount: deleteAccount,
    // 附加工具（非契约必需，前端可选用）
    utils: {
      mergeProgress: mergeProgress,
      normalizeProgress: normalizeProgress,
      computeStreak: computeStreak,
      isoWeekKey: isoWeekKey,
      currentWeekKey: currentWeekKey,
      todayStr: todayStr
    }
  };
})();
