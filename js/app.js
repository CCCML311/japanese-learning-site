/* 日语学习站 · 公共脚本：页头页脚、吉祥物、学习进度（经验值/打卡/等级）、登录、朗读、测验组件 */
(function () {
  'use strict';

  /* ---------- 站点设置（上线前在这里填写） ---------- */
  var SITE = window.BREEZE_SITE = {
    name: '日语学习站',
    teacher: 'あお老师',
    contactEmail: 'chinmure@outlook.com', // あお老师专用邮箱（不要用简历上的邮箱，避免两个身份被关联）
    wechat: 'chinmure',        // あお老师微信号
    voiceCredit: 'VOICEVOX:四国めたん', // 五十音发音音频的声源标注（四国めたん利用规约要求必须标注，请勿删除）
    icp: '',                   // ICP 备案号，例如 '沪ICP备2026012345号-1'。备案通过后填写，页脚会自动显示并链接到工信部网站
    police: ''                 // 公安联网备案号（如有），例如 '沪公网安备31010402000001号'
  };

  /* 记下最近几条脚本报错，报告问题时一起附上，方便定位 */
  window.__breezeErrors = [];
  window.addEventListener('error', function (e) { try { window.__breezeErrors.push(((e.message || '') + ' @' + (e.filename || '').split('/').pop() + ':' + (e.lineno || '')).slice(0, 160)); if (window.__breezeErrors.length > 5) window.__breezeErrors.shift(); } catch (er) { } });

  /* ---------- 小工具 ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function today(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function isoWeek(d) {
    d = new Date(Date.UTC((d || new Date()).getFullYear(), (d || new Date()).getMonth(), (d || new Date()).getDate()));
    var day = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() + 4 - day);
    var y0 = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return d.getUTCFullYear() + '-W' + pad(Math.ceil(((d - y0) / 86400000 + 1) / 7));
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  /* ---------- 吉祥物：水母「ふわり」与晴天娃娃（原创绘制） ---------- */
  function jelly(expr, label) {
    /* 发光的半透明水母：表情用光色表达（答对＝薄荷绿，答错＝玫瑰色，思考＝紫） */
    var pal = { happy: ['#BFE8FF', '#F6B8CF', '#8ED1FF'], think: ['#C9C2FF', '#8ED1FF', '#9D8CFF'], right: ['#C8FFF0', '#FFE2A6', '#7FE6CC'], wrong: ['#FFD0DC', '#B69CFF', '#F3A3B8'] }[expr || 'happy'];
    var id = 'j' + Math.random().toString(36).slice(2, 7);
    return '<svg class="jelly-svg" viewBox="0 0 120 170" role="img" aria-label="' + esc(label || '水母ふわり') + '">' +
      '<defs><radialGradient id="' + id + 'b" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="' + pal[0] + '" stop-opacity=".75"/><stop offset="1" stop-color="' + pal[1] + '" stop-opacity=".25"/></radialGradient>' +
      '<linearGradient id="' + id + 't" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + pal[2] + '" stop-opacity=".9"/><stop offset="1" stop-color="' + pal[1] + '" stop-opacity="0"/></linearGradient>' +
      '<filter id="' + id + 'g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
      '<ellipse cx="60" cy="52" rx="56" ry="46" fill="' + pal[2] + '" opacity=".14"/>' +
      '<g fill="none" stroke="url(#' + id + 't)" stroke-linecap="round">' +
      '<path class="tent" stroke-width="1.4" d="M34 74 C30 100 42 118 34 166"/><path class="tent t2" stroke-width="1.2" d="M46 76 C50 104 40 124 48 162"/>' +
      '<path class="tent t3" stroke-width="1.2" d="M74 76 C70 104 80 124 72 162"/><path class="tent" stroke-width="1.4" d="M86 74 C90 100 78 118 86 166"/>' +
      '<path class="tent t2" stroke-width="3.2" stroke-opacity=".6" d="M54 74 C50 92 60 104 54 130 C52 140 58 146 56 152"/><path class="tent t3" stroke-width="3.2" stroke-opacity=".6" d="M66 74 C70 92 60 104 66 130 C68 140 62 146 64 152"/></g>' +
      '<g filter="url(#' + id + 'g)"><path d="M16 72 C14 36 38 14 60 14 C82 14 106 36 104 72 C98 77 92 73 86 77 C80 73 74 78 68 74 C62 79 58 79 52 74 C46 78 40 73 34 77 C28 73 22 77 16 72Z" fill="url(#' + id + 'b)" stroke="#fff" stroke-opacity=".55" stroke-width="1"/></g>' +
      '<path d="M30 40 C36 26 48 20 58 20" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<g fill="#fff" opacity=".9"><circle cx="60" cy="48" r="2.2"/><circle cx="48" cy="54" r="1.3"/><circle cx="72" cy="54" r="1.3"/><circle cx="60" cy="62" r="1"/></g>' +
      '</svg>';
  }
  function teru(sunny) {
    /* 细线条的晴天娃娃纸符；放晴时带金色光晕 */
    var c = sunny ? '#E7A447' : '#9AA8C7';
    return '<svg viewBox="0 0 40 72" aria-hidden="true"><path d="M20 0 v12" stroke="' + c + '" stroke-width="1"/>' +
      (sunny ? '<circle cx="20" cy="24" r="16" fill="#FFCD82" opacity=".18"/>' : '') +
      '<circle cx="20" cy="24" r="10" fill="none" stroke="' + c + '" stroke-width="1.2"/>' +
      '<path d="M11 32 C13 46 9 58 6 68 M29 32 C27 46 31 58 34 68 M14 34 C16 48 14 60 13 68 M26 34 C24 48 26 60 27 68" fill="none" stroke="' + c + '" stroke-width="1" stroke-linecap="round"/>' +
      '<path d="M12 33 C17 36 23 36 28 33" fill="none" stroke="' + (sunny ? '#F3A3B8' : c) + '" stroke-width="1.4" stroke-linecap="round"/></svg>';
  }

  /* ---------- 学习进度（本机保存，登录后同步） ---------- */
  var KEY = 'breeze-progress-v1';
  var LEVELS = [
    [0, '五十音见习'], [60, '假名学徒'], [160, '清音达人'], [320, '浊音挑战者'], [520, '拗音高手'],
    [800, 'N5 挑战者'], [1200, 'N5 合格'], [1800, 'N4 挑战者'], [2600, 'N4 合格'], [3600, 'N3 挑战者']
  ];
  function blank() { return { xp: 0, streak: 0, lastCheckin: null, checkins: [], best: { kanaQuiz: 0 }, weekKey: isoWeek(), weekXp: 0, updatedAt: 0, flags: {} }; }
  function load() {
    var p = blank();
    try { var s = localStorage.getItem(KEY); if (s) { var o = JSON.parse(s); for (var k in o) p[k] = o[k]; } } catch (e) { }
    if (!p.best) p.best = { kanaQuiz: 0 }; if (!p.flags) p.flags = {}; if (!Array.isArray(p.checkins)) p.checkins = [];
    if (p.weekKey !== isoWeek()) { p.weekKey = isoWeek(); p.weekXp = 0; }
    p.streak = calcStreak(p.checkins);
    return p;
  }
  function save() { P.updatedAt = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { } }
  function calcStreak(list) {
    var set = {}; list.forEach(function (d) { set[d] = 1; });
    var d = new Date(), n = 0;
    if (!set[today(d)]) d.setDate(d.getDate() - 1); // 今天还没打卡时，从昨天往前数
    while (set[today(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function levelOf(xp) {
    var i = 0; while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++;
    var cur = LEVELS[i], next = LEVELS[i + 1];
    return { idx: i + 1, name: cur[1], from: cur[0], to: next ? next[0] : null, pct: next ? Math.round((xp - cur[0]) / (next[0] - cur[0]) * 100) : 100, nextName: next ? next[1] : null };
  }
  var P = load();
  /* 同时开着几个页面时：每次改进度前先从本机读最新的，避免旧页面把新进度覆盖掉 */
  function refresh() { var n = load(); for (var k in P) if (!(k in n)) delete P[k]; for (var k2 in n) P[k2] = n[k2]; return P; }
  window.addEventListener('storage', function (e) { if (e.key === KEY) { refresh(); renderXpPill(); listeners.forEach(function (f) { try { f(P); } catch (er) { } }); } });
  var listeners = [];
  function changed() { save(); renderXpPill(); listeners.forEach(function (f) { try { f(P); } catch (e) { } }); scheduleSync(); }
  function checkin() {
    var t = today();
    if (P.checkins.indexOf(t) < 0) {
      P.checkins.push(t); P.checkins = P.checkins.slice(-60); P.lastCheckin = t; P.streak = calcStreak(P.checkins);
      toast('今日打卡成功！连续 ' + P.streak + ' 天，晴天娃娃又多挂了一个');
      return true;
    }
    return false;
  }
  function addXP(n, reason) {
    refresh();
    var before = levelOf(P.xp).idx;
    P.xp += n; if (P.weekKey !== isoWeek()) { P.weekKey = isoWeek(); P.weekXp = 0; } P.weekXp += n;
    var first = checkin();
    var after = levelOf(P.xp);
    if (after.idx > before) toast('升级啦！现在是「' + after.name + '」');
    else if (!first && reason) toast('+' + n + ' 经验值 · ' + reason);
    changed();
  }
  function onceToday(flag) { refresh(); var t = today(); if (P.flags[flag] === t) return false; P.flags[flag] = t; save(); return true; }

  /* ---------- 后端（腾讯云开发）对接，未配置时自动进入本机模式 ---------- */
  var API = window.BreezeAPI || {
    init: function () { return Promise.resolve({ online: false }); }, isOnline: function () { return false; }, isLoggedIn: function () { return false; },
    getUser: function () { return null; }, sendCode: function () { return Promise.resolve({ ok: false, error: 'demo' }); },
    verifyCode: function () { return Promise.resolve({ ok: false, error: 'demo' }); }, logout: function () { return Promise.resolve(); },
    syncProgress: function (l) { return Promise.resolve(l); }, getLeaderboard: function () { return Promise.resolve([]); },
    submitInquiry: function () { return Promise.resolve({ ok: false, error: 'demo' }); }, deleteAccount: function () { return Promise.resolve({ ok: false, error: 'demo' }); }
  };
  var syncTimer;
  function scheduleSync() {
    if (!API.isOnline() || !API.isLoggedIn()) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      API.syncProgress(P).then(function (m) { if (m && typeof m.xp === 'number') { for (var k in m) P[k] = m[k]; save(); renderXpPill(); } });
    }, 1500);
  }

  /* ---------- 朗读：优先播放录好的音频，没有就用浏览器的日语朗读 ---------- */
  var audioOk = null; // null 未知，true/false 已检测（五十音）
  /* 句子音频：audio/v/<哈希>.mp3，由 VOICEVOX 预先合成；audio/v/index.js 列出已有的文件 */
  function h32(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
  var AIDX = null;
  function audioIdx() {
    var src = (window.AUDIO_IDX || '') + ',' + (window.AUDIO_IDX_VOCAB || '');
    if (AIDX && AIDX._n === src.length) return AIDX;
    AIDX = { _n: src.length }; src.split(',').forEach(function (h) { if (h) AIDX[h] = 1; }); return AIDX;
  }
  (function () { if (window.AUDIO_IDX) return; var sc = document.createElement('script'); sc.src = 'audio/v/index.js'; sc.async = true; (document.head || document.documentElement).appendChild(sc); })();
  function clipUrl(text) { var h = h32(String(text || '')); return audioIdx()[h] ? 'audio/v/' + h + '.mp3' : null; }
  /* 单词音频用「单词|读音」做键，同音词（橋/箸）各有各的录音 */
  function wordKey(w, k) { return 'w:' + w + '|' + k; }
  var curAudio = null;
  function stopAudio() { if (curAudio) { try { curAudio.pause(); } catch (e) { } curAudio = null; } try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { } }
  function jaVoice() { try { return speechSynthesis.getVoices().filter(function (v) { return /ja/i.test(v.lang); })[0]; } catch (e) { return null; } }
  function tts(text, o) {
    if (!('speechSynthesis' in window)) { toast('这个浏览器不支持朗读，请换 Chrome 或 Safari 试试'); if (o.onend) o.onend(true); return; }
    try {
      var u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; u.rate = o.ttsRate || 0.85; if (o.pitch) u.pitch = o.pitch;
      var v = o.voice || jaVoice(); if (v) u.voice = v;
      u.onend = function () { if (o.onend) o.onend(); }; u.onerror = function () { if (o.onend) o.onend(true); };
      speechSynthesis.speak(u);
    } catch (e) { if (o.onend) o.onend(true); }
  }
  /* 播放一句：有录好的音频就放音频，没有就用浏览器朗读。o = {rate, ttsRate, pitch, voice, onend(err)} */
  function play(text, o) {
    o = o || {}; stopAudio();
    var url = clipUrl(o.key || text);
    if (!url) return tts(text, o);
    var a = new Audio(url), fellBack = false; curAudio = a;
    try { a.playbackRate = o.rate || 1; } catch (e) { }
    function fb() { if (fellBack || curAudio !== a) return; fellBack = true; curAudio = null; tts(text, o); }
    a.onended = function () { if (curAudio !== a) return; curAudio = null; if (o.onend) o.onend(); };
    a.onerror = fb;
    var pr = a.play(); if (pr && pr.catch) pr.catch(fb);
  }
  function speak(text, key) { play(text, { ttsRate: 0.85, key: key }); }
  function playKana(file, text) {
    if (audioOk === false) { speak(text); return; }
    var a = new Audio('audio/kana/' + file + '.mp3');
    a.addEventListener('error', function () { audioOk = false; speak(text); }, { once: true });
    a.play().then(function () { audioOk = true; showCredit(); }).catch(function () { if (audioOk !== true) { audioOk = false; speak(text); } });
  }
  function showCredit() { }

  /* ---------- 页头 / 页脚 ---------- */
  var NAV = [['home', 'index.html', '首页'], ['kana', 'kana.html', '五十音'], ['grammar', 'grammar.html', '文法'], ['vocab', 'vocab.html', '单词'], ['jlpt', 'jlpt.html', 'JLPT'], ['immersion', 'immersion.html', '沉浸学习'], ['games', 'games.html', '小游戏']];
  /* 手机「全部栏目」弹出卡片里的分组 */
  var NAV_ALL = [['学', [['index.html', '首页', 'home'], ['kana.html', '五十音', 'kana'], ['grammar.html', '文法 · 动词变形', 'grammar'], ['vocab.html', '单词', 'vocab']]],
    ['练 & 读', [['jlpt.html', 'JLPT · 模拟卷', 'jlpt'], ['immersion.html', '沉浸学习', 'immersion'], ['games.html', '小游戏', 'games'], ['column.html', '专栏', 'column']]],
    ['老师 & 更多', [['about.html', 'あお老师 · 课程口译', 'about'], ['downloads.html', '免费资料', 'downloads'], ['faq.html', '常见问题', 'faq'], ['about.html?ask=1', '咨询 / 预约试听', 'contact'], ['about.html?ask=1&type=bug', '报告问题', 'bug']]]];
  var TEACHER_PAGES = { about: 1, courses: 1, interpret: 1, contact: 1 };
  function openMenu() {
    var page = document.body.getAttribute('data-page');
    sheet('全部栏目', function (b) {
      b.innerHTML = NAV_ALL.map(function (g) {
        return '<div class="menu-g"><span class="eyebrow">' + g[0] + '</span><div class="menu-links">' + g[1].map(function (l) {
          return '<a href="' + l[0] + '"' + (l[2] === page ? ' aria-current="page"' : '') + (l[2] === 'bug' ? ' data-inquiry="bug"' : l[2] === 'contact' ? ' data-inquiry=""' : '') + '>' + l[1] + '</a>';
        }).join('') + '</div></div>';
      }).join('');
    });
  }
  function renderChrome() {
    var page = document.body.getAttribute('data-page');
    var head = $('#site-head');
    if (head) {
      head.className = 'site-head';
      head.innerHTML = '<div class="wrap"><a class="logo" href="index.html">' + jelly('happy', '') + '<span>' + SITE.name + '<small>' + SITE.teacher + ' · 五十音到 N1</small></span></a>' +
        '<nav class="nav" aria-label="主导航">' + NAV.map(function (n) { return '<a href="' + n[1] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '>' + n[2] + '</a>'; }).join('') + '</nav>' +
        '<div class="head-tools"><a class="btn btn-small btn-ghost teacher-btn" href="about.html"' + (TEACHER_PAGES[page] ? ' aria-current="page"' : '') + '>找老师</a><span class="xp-pill" id="xp-pill"></span><button class="btn btn-small login-btn" type="button" id="login-open">登录</button><button class="menu-btn" type="button" id="menu-open" aria-label="全部栏目"><span></span><span></span><span></span></button></div></div>';
      $('#login-open').addEventListener('click', openLogin);
      $('#menu-open').addEventListener('click', openMenu);
    }
    var foot = $('#site-foot');
    if (foot) {
      foot.className = 'site-foot';
      foot.innerHTML = '<div class="wrap"><div><strong>' + SITE.name + '</strong> · ' + SITE.teacher + '<br>免费学日语，从五十音到 N1。' +
        (SITE.contactEmail || SITE.wechat ? '<br><span id="site-contact">' + (SITE.contactEmail ? '邮箱 <a href="mailto:' + esc(SITE.contactEmail) + '">' + esc(SITE.contactEmail) + '</a>' : '') + (SITE.contactEmail && SITE.wechat ? ' · ' : '') + (SITE.wechat ? '微信 ' + esc(SITE.wechat) : '') + '</span>' : '') + '<br><span id="sync-note">学习进度保存在本机；登录后可在不同设备同步。</span><br><span id="voice-credit">五十音发音：' + SITE.voiceCredit + '；单词与例句：VOICEVOX:春日部つむぎ；听力与句子朗读：VOICEVOX:冥鳴ひまり、VOICEVOX:玄野武宏、VOICEVOX:四国めたん</span>' + (SITE.icp ? '<br><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">' + esc(SITE.icp) + '</a>' : '') + (SITE.police ? '　<span>' + esc(SITE.police) + '</span>' : '') + '</div>' +
        '<nav aria-label="页脚"><a href="about.html">あお老师</a><a href="column.html">专栏</a><a href="downloads.html">免费资料</a><a href="faq.html">常见问题</a><a href="about.html?ask=1" data-inquiry="">联系我们</a><a href="about.html?ask=1&amp;type=bug" data-inquiry="bug">报告问题</a><a href="policies.html">条款与隐私</a></nav>' +
        '<div class="small">© ' + new Date().getFullYear() + ' ' + SITE.name + ' · 动漫台词与片段版权归原作者所有，仅用于语言学习说明</div></div>';
    }
    renderXpPill();
  }
  function renderXpPill() {
    var el = $('#xp-pill'); if (!el) return;
    var lv = levelOf(P.xp);
    el.innerHTML = '<span class="lv">Lv.' + lv.idx + '</span><span class="num">' + P.xp + ' XP</span>' + (P.streak ? '<span aria-label="连续打卡天数">連続 ' + P.streak + '</span>' : '');
    el.title = lv.name;
    var lb = $('#login-open');
    if (lb) { var u = API.isLoggedIn() ? API.getUser() : null; lb.textContent = u ? (u.nickname || '我的') : '登录'; }
  }

  /* ---------- 登录弹窗（邮箱验证码） ---------- */
  /* ---------- 弹出卡片：手机上从底部滑出，电脑上居中；点空白处、Esc、✕ 都能关 ---------- */
  var sheetEl = null, sheetBack = null, sheetOnClose = null;
  function closeSheet() {
    if (!sheetEl || sheetEl.hidden) return;
    sheetEl.hidden = true; document.documentElement.style.overflow = '';
    var f = sheetOnClose; sheetOnClose = null; if (f) f();
    if (sheetBack && sheetBack.focus) { try { sheetBack.focus({ preventScroll: true }); } catch (e) { } }
  }
  function sheet(title, build, onClose) {
    if (!sheetEl) {
      sheetEl = document.createElement('div'); sheetEl.className = 'modal sheet'; sheetEl.hidden = true;
      sheetEl.setAttribute('role', 'dialog'); sheetEl.setAttribute('aria-modal', 'true'); sheetEl.setAttribute('aria-labelledby', 'sheet-title');
      sheetEl.innerHTML = '<div class="sheet-box"><div class="sheet-head"><h3 id="sheet-title"></h3><button type="button" class="sheet-x" aria-label="关闭">✕</button></div><div class="sheet-body"></div></div>';
      document.body.appendChild(sheetEl);
      sheetEl.addEventListener('click', function (e) { if (e.target === sheetEl) closeSheet(); });
      $('.sheet-x', sheetEl).onclick = closeSheet;
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
    }
    closeSheet();
    sheetBack = document.activeElement; sheetOnClose = onClose || null;
    $('#sheet-title', sheetEl).textContent = title;
    var body = $('.sheet-body', sheetEl); body.innerHTML = ''; body.scrollTop = 0;
    sheetEl.hidden = false; document.documentElement.style.overflow = 'hidden';
    if (typeof build === 'function') build(body); else body.innerHTML = build || '';
    $('.sheet-x', sheetEl).focus({ preventScroll: true });
    return body;
  }

  function openLogin() {
    var m = $('#login-modal');
    if (!m) {
      m = document.createElement('div'); m.id = 'login-modal'; m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'login-title');
      document.body.appendChild(m);
      m.addEventListener('click', function (e) { if (e.target === m) m.hidden = true; });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') m.hidden = true; });
      new MutationObserver(function () { document.documentElement.style.overflow = m.hidden ? '' : 'hidden'; }).observe(m, { attributes: true, attributeFilter: ['hidden'] });
    }
    var u = API.isLoggedIn() ? API.getUser() : null;
    if (u) {
      m.innerHTML = '<div class="modal-box">' + jelly('happy') .replace('<svg', '<svg style="width:72px;height:90px;align-self:center"') + '<h3 id="login-title">你好，' + esc(u.nickname || '同学') + '</h3>' +
        '<p class="muted small" style="margin:0">' + esc(u.email || '') + ' · 学习进度已同步到账号</p>' +
        '<button class="btn btn-ghost" type="button" id="lo-out">退出登录</button>' +
        '<button class="btn btn-ghost" type="button" id="lo-del" style="color:var(--rose)">注销账号并删除学习数据</button><p class="form-msg" id="lo-msg"></p>' +
        '<button class="btn btn-sky" type="button" id="lo-close">关闭</button></div>';
      $('#lo-out', m).onclick = function () { API.logout().then(function () { m.hidden = true; renderXpPill(); toast('已退出登录'); }); };
      var armed = false;
      $('#lo-del', m).onclick = function () {
        if (!armed) { armed = true; $('#lo-msg', m).className = 'form-msg err'; $('#lo-msg', m).textContent = '再点一次确认注销。注销后账号和云端学习记录会被删除，无法恢复。'; return; }
        API.deleteAccount().then(function (r) { $('#lo-msg', m).textContent = r.ok ? '账号已注销' : ('注销失败：' + (r.error || '请稍后再试')); if (r.ok) setTimeout(function () { m.hidden = true; renderXpPill(); }, 1200); });
      };
      $('#lo-close', m).onclick = function () { m.hidden = true; };
    } else {
      var online = API.isOnline();
      m.innerHTML = '<div class="modal-box">' + jelly('happy').replace('<svg', '<svg style="width:64px;height:90px;align-self:center"') +
        '<h3 id="login-title">邮箱验证码登录</h3>' +
        '<p class="muted small" style="margin:0">登录后，经验值、打卡和测验成绩可以在手机和电脑之间同步，还能上周排行榜。不登录也能正常学习。</p>' +
        (online ? '' : '<p class="note">预览模式：后端还没连接，登录暂时不可用。</p>') +
        '<div class="field"><label for="lg-email">邮箱</label><input id="lg-email" type="email" autocomplete="email" placeholder="name@example.com"></div>' +
        '<button class="btn btn-sky" type="button" id="lg-send">发送验证码</button>' +
        '<div class="field"><label for="lg-code">6 位验证码</label><input id="lg-code" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div>' +
        '<div class="field"><label for="lg-nick">昵称（会显示在排行榜，1–12 个字）</label><input id="lg-nick" maxlength="12"></div>' +
        '<label class="check"><input type="checkbox" id="lg-agree"><span>我已阅读并同意<a href="policies.html#privacy" target="_blank">隐私政策</a>和<a href="policies.html#user-terms" target="_blank">用户协议</a></span></label>' +
        '<button class="btn btn-sun" type="button" id="lg-go">登录 / 注册</button><p class="form-msg" id="lg-msg" aria-live="polite"></p>' +
        '<button class="btn btn-ghost" type="button" id="lg-close">先不登录</button></div>';
      var msg = function (t, ok) { var e = $('#lg-msg', m); e.textContent = t; e.className = 'form-msg ' + (ok ? 'ok' : 'err'); };
      $('#lg-close', m).onclick = function () { m.hidden = true; };
      $('#lg-send', m).onclick = function () {
        var em = $('#lg-email', m).value.trim();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return msg('邮箱格式不对，请检查一下');
        if (!online) return msg('预览模式下不能发送验证码');
        var b = this; b.disabled = true; API.sendCode(em).then(function (r) {
          if (r.ok) { msg('验证码已发送，请查收邮件（也看看垃圾箱）', true); var s = 60; var t = setInterval(function () { b.textContent = s-- + ' 秒后可重发'; if (s < 0) { clearInterval(t); b.disabled = false; b.textContent = '重新发送'; } }, 1000); }
          else { b.disabled = false; msg('发送失败：' + (r.error || '请稍后再试')); }
        });
      };
      $('#lg-go', m).onclick = function () {
        var em = $('#lg-email', m).value.trim(), code = $('#lg-code', m).value.trim(), nick = $('#lg-nick', m).value.trim();
        if (!$('#lg-agree', m).checked) return msg('请先勾选同意隐私政策和用户协议');
        if (!/^\d{6}$/.test(code)) return msg('请输入邮件里的 6 位数字验证码');
        if (!nick) return msg('起一个昵称吧');
        if (!online) return msg('预览模式下不能登录');
        API.verifyCode(em, code, nick).then(function (r) {
          if (!r.ok) return msg('登录失败：' + (r.error || '验证码不正确或已过期'));
          API.syncProgress(P).then(function (mg) { if (mg) { for (var k in mg) P[k] = mg[k]; save(); } m.hidden = true; renderXpPill(); changed(); toast('登录成功，进度已同步'); });
        });
      };
    }
    m.hidden = false; document.documentElement.style.overflow = "hidden";
    var f = m.querySelector('input,button'); if (f) f.focus();
  }

  /* ---------- 假名测验组件（五十音页和首页每日挑战共用） ---------- */
  function Quiz(root, opts) {
    var pool = opts.pool, count = opts.count || 10, mode = opts.mode || 'read', script = opts.script || 'h';
    var qs = shuffle(pool).slice(0, Math.min(count, pool.length)), i = 0, score = 0, wrong = [];
    function glyph(item) { var s = script === 'mix' ? (Math.random() < .5 ? 'h' : 'k') : script; return s === 'k' ? item.k : item.h; }
    function draw() {
      if (i >= qs.length) return finish();
      var q = qs[i], g = glyph(q);
      var distract = shuffle(pool.filter(function (p) { return p.r !== q.r; })).slice(0, 3);
      var opts4 = shuffle([q].concat(distract));
      var dots = qs.map(function (_, n) { return '<i class="' + (n < i ? (wrong.some(function (w) { return w.n === n; }) ? 'w' : 'r') : n === i ? 'c' : '') + '"></i>'; }).join('');
      root.innerHTML = '<div class="quiz"><div class="q-top"><div class="dots" aria-label="第 ' + (i + 1) + ' 题，共 ' + qs.length + ' 题">' + dots + '</div><span class="muted small num">' + (i + 1) + ' / ' + qs.length + '</span></div>' +
        (mode === 'read'
          ? '<div class="q-kana" aria-label="题目假名">' + g + '</div><p class="muted small" style="margin:0;text-align:center">这个假名怎么读？</p>'
          : '<div class="q-kana" style="font-size:1.25rem;font-family:inherit;font-weight:900"><button class="btn btn-sky" type="button" data-say>▶ 再听一遍</button></div><p class="muted small" style="margin:0;text-align:center">听发音，选出对应的假名</p>') +
        '<div class="q-opts">' + opts4.map(function (o) { return '<button type="button" class="opt' + (mode === 'listen' ? ' kana' : '') + '" data-r="' + esc(o.r) + '">' + (mode === 'read' ? esc(o.r) : (script === 'k' ? o.k : o.h)) + '</button>'; }).join('') + '</div>' +
        '<div class="feedback" aria-live="polite">' + jelly('think') + '<span class="muted">选一个答案吧</span></div></div>';
      if (mode === 'listen') { var say = function () { playKana(q.f, q.h); }; $('[data-say]', root).onclick = say; say(); }
      $$('.opt', root).forEach(function (b) {
        b.onclick = function () {
          var ok = b.getAttribute('data-r') === q.r;
          $$('.opt', root).forEach(function (x) { x.disabled = true; if (x.getAttribute('data-r') === q.r) x.classList.add('right'); });
          if (!ok) { b.classList.add('wrong'); wrong.push({ n: i, q: q, g: g }); } else score++;
          $('.feedback', root).innerHTML = jelly(ok ? 'right' : 'wrong') + '<span><b>' + (ok ? 'すごい！答对了' : 'ドンマイ！正确答案是 ' + esc(q.r)) + '</b>　' + g + ' = ' + esc(q.r) + '</span>';
          if (mode === 'read') playKana(q.f, q.h);
          if (ok && opts.xpPer) addXP(opts.xpPer);
          setTimeout(function () { i++; draw(); }, ok ? 900 : 1700);
        };
      });
    }
    function finish() {
      var perfect = score === qs.length, bonus = (opts.bonus || 0) + (perfect ? (opts.perfectBonus || 0) : 0);
      if (bonus) addXP(bonus, opts.title || '完成测验');
      if (opts.onFinish) opts.onFinish(score, qs.length);
      root.innerHTML = '<div class="quiz" style="align-items:center;text-align:center">' + jelly(perfect ? 'right' : score >= qs.length * .6 ? 'happy' : 'think').replace('<svg', '<svg style="width:90px;height:128px"') +
        '<h3 style="font-size:1.5rem">' + score + ' / ' + qs.length + (perfect ? '　全对！' : '') + '</h3>' +
        (bonus ? '<p class="muted" style="margin:0">本轮奖励 +' + bonus + ' 经验值</p>' : '') +
        (wrong.length ? '<div style="width:100%"><p style="margin:8px 0 6px;font-weight:900">错题回顾（点一下听发音）</p><div class="kgrid">' + wrong.map(function (w) { return '<button type="button" class="kcell" data-f="' + esc(w.q.f) + '" data-h="' + esc(w.q.h) + '"><span class="k">' + w.g + '</span><span class="r">' + esc(w.q.r) + '</span></button>'; }).join('') + '</div></div>' : '') +
        '<div class="hero-cta" style="justify-content:center"><button class="btn btn-sun" type="button" data-again>再来一轮</button></div></div>';
      $$('[data-f]', root).forEach(function (b) { b.onclick = function () { playKana(b.getAttribute('data-f'), b.getAttribute('data-h')); }; });
      $('[data-again]', root).onclick = function () { if (opts.again) opts.again(); else { qs = shuffle(pool).slice(0, Math.min(count, pool.length)); i = 0; score = 0; wrong = []; draw(); } };
    }
    draw();
  }

  /* ---------- JLPT 倒计时：每年 7 月和 12 月的第一个星期日 ---------- */
  function nextJLPT() {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    for (var y = now.getFullYear(); y <= now.getFullYear() + 1; y++) {
      for (var mi = 0; mi < 2; mi++) {
        var m = mi ? 11 : 6, d = new Date(y, m, 1); while (d.getDay() !== 0) d.setDate(d.getDate() + 1);
        if (d >= now) return { date: d, days: Math.round((d - now) / 86400000) };
      }
    }
  }

  /* ---------- 公开接口 ---------- */

  /* ---------- 页内标签页：<div class="ptabs" role="tablist"><button role="tab" aria-controls="panelId"> ----------
     面板加 class="tabpanel"。网址 #panelId 或面板里任意元素的 #id 都会切到对应标签。 */
  var tabSets = [];
  function initTabs() {
    $$('.ptabs[role=tablist]').forEach(function (bar) {
      var tabs = $$('[role=tab]', bar);
      var set = { bar: bar, tabs: tabs, panels: tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); }) };
      tabSets.push(set);
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { selectTab(set.panels[i].id, true); });
        t.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
          var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
        });
      });
      var init = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
      show(set, init < 0 ? 0 : init);
    });
    if (location.hash) hashTab(location.hash.slice(1), true);
    window.addEventListener('hashchange', function () { hashTab(location.hash.slice(1), true); });
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
      var id = a.getAttribute('href').slice(1); if (!id) return;
      if (hashTab(id, false)) { var el = document.getElementById(id); if (el && el.classList.contains('tabpanel')) { e.preventDefault(); history.replaceState(null, '', '#' + id); scrollToBar(id); } }
    });
  }
  function show(set, i) {
    set.tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
    set.panels.forEach(function (p, k) { if (p) p.hidden = k !== i; });
    var t = set.tabs[i]; if (t && t.scrollIntoView && set.bar.scrollWidth > set.bar.clientWidth) set.bar.scrollLeft = t.offsetLeft - 20;
    document.dispatchEvent(new CustomEvent('tabchange', { detail: { panel: set.panels[i] && set.panels[i].id } }));
  }
  function hashTab(id, scroll) {
    var el = id && document.getElementById(decodeURIComponent(id)); if (!el) return false;
    var hit = false;
    tabSets.forEach(function (set) {
      set.panels.forEach(function (p, i) { if (p && (p === el || p.contains(el))) { show(set, i); hit = true; } });
    });
    if (hit && scroll) setTimeout(function () { if (el.classList.contains('tabpanel')) scrollToBar(el.id); else { var tgt = el.closest('details') && !el.closest('details').open ? el.closest('details') : el; window.scrollTo({ top: tgt.getBoundingClientRect().top + window.scrollY - 90 }); } }, 30);
    return hit;
  }
  function scrollToBar(id) {
    var set = tabSets.find(function (s) { return s.panels.some(function (p) { return p && p.id === id; }); }); if (!set) return;
    var y = set.bar.getBoundingClientRect().top + window.scrollY - 90; if (window.scrollY > y) window.scrollTo({ top: y });
  }
  function selectTab(id, push) {
    hashTab(id, false);
    if (push) history.replaceState(null, '', '#' + id);
  }
  /* 回到顶部按钮：长页面（body[data-totop]）滚过 2 屏后出现 */
  function initToTop() {
    if (!document.body.hasAttribute('data-totop')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'to-top'; b.hidden = true; b.setAttribute('aria-label', '回到顶部'); b.textContent = '↑';
    b.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    document.body.appendChild(b);
    window.addEventListener('scroll', function () { b.hidden = window.scrollY < window.innerHeight * 2; }, { passive: true });
  }

  /* 咨询弹窗：页面没加载 js/inquiry.js 时，点 [data-inquiry] 再按需加载，原地弹出 */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-inquiry]'); if (!a || (window.Breeze && window.Breeze.inquiry)) return;
    e.preventDefault();
    var type = a.getAttribute('data-inquiry'), sc = document.createElement('script');
    sc.src = 'js/inquiry.js';
    sc.onload = function () { if (window.Breeze.inquiry) window.Breeze.inquiry(type); else location.href = a.href; };
    sc.onerror = function () { location.href = a.getAttribute('href') || 'about.html?ask=1'; };
    document.head.appendChild(sc);
  });

  window.Breeze = { $: $, $$: $$, esc: esc, today: today, jelly: jelly, teru: teru, P: function () { return refresh(); }, addXP: addXP, onceToday: onceToday, levelOf: levelOf, LEVELS: LEVELS, onChange: function (f) { listeners.push(f); }, Quiz: Quiz, playKana: playKana, speak: speak, play: play, stopAudio: stopAudio, hasClip: function (t) { return !!clipUrl(t); }, wordKey: wordKey, toast: toast, API: API, nextJLPT: nextJLPT, shuffle: shuffle, openLogin: openLogin, sheet: sheet, closeSheet: closeSheet, selectTab: selectTab, openMenu: openMenu, save: function () { save(); } };

  document.addEventListener('DOMContentLoaded', function () {
    renderChrome(); initTabs(); initToTop();
    API.init().then(function (r) {
      renderXpPill();
      if (r && r.online && API.isLoggedIn()) API.syncProgress(P).then(function (m) { if (m) { for (var k in m) P[k] = m[k]; save(); renderXpPill(); listeners.forEach(function (f) { f(P); }); } });
      document.dispatchEvent(new CustomEvent('breeze:ready', { detail: r || { online: false } }));
    });
  });
})();
