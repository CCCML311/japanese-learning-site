/* 学习页公用组件：选择题、注音开关、朗读按钮、本机记录 */
(function () {
  var B = window.Breeze, $ = B.$, $$ = B.$$, esc = B.esc;

  function plain(html) { return String(html || '').replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, ''); }
  function mark(s) { return String(s || '').replace(/【(.*?)】/g, '<u class="mk">$1</u>'); }
  function rb(s) { return esc(s).replace(/\[([^|\]]+)\|([^\]]+)\]/g, '<ruby>$1<rt>$2</rt></ruby>'); }
  function sayBtn(text, label, key) { return '<button type="button" class="say" data-say="' + esc(plain(text)) + '"' + (key ? ' data-key="' + esc(key) + '"' : '') + ' aria-label="' + (label || '朗读') + '">▶</button>'; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-say]'); if (!b || b.hasAttribute('data-say-own')) return;
    var t = b.getAttribute('data-say'); if (t) { B.speak(t, b.getAttribute('data-key') || undefined); b.classList.add('on'); setTimeout(function () { b.classList.remove('on'); }, 900); }
  });

  /* 注音 / 中文 开关：容器加 class 控制 */
  function toggles(root, target, opts) {
    opts = opts || {};
    var html = '<div class="toggles">' +
      '<label class="check"><input type="checkbox" data-t="no-rt"' + (opts.rt === false ? '' : ' checked') + '> 显示注音</label>' +
      (opts.zh === false ? '' : '<label class="check"><input type="checkbox" data-t="no-zh" checked> 显示中文</label>') + '</div>';
    root.innerHTML = html;
    $$('input', root).forEach(function (i) {
      var apply = function () { target.classList.toggle(i.getAttribute('data-t'), !i.checked); };
      i.onchange = apply; apply();
    });
  }

  /* 本机记录（不同步到云端的小数据，比如单词卡掌握情况） */
  function store(key, def) {
    /* 每次读都从 localStorage 取，避免同时开着两个页面时互相覆盖 */
    var k = 'breeze-' + key, v;
    function read() { var r = null; try { r = JSON.parse(localStorage.getItem(k)); } catch (e) { } if (r != null) v = r; else if (v == null) v = JSON.parse(JSON.stringify(def)); return v; }
    read();
    return { get: read, set: function (n) { v = n; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
  }
  function best(key, score) {
    var P = B.P(); P.best = P.best || {};
    if (score == null) return P.best[key] || 0;
    if (score > (P.best[key] || 0)) { P.best[key] = score; B.save(); return true; }
    return false;
  }

  /* 文字选项选择题
     items: [{q (可含 ruby/【】), options[], answer(下标), why, tag}]
     opts: {title, xpPer, bonus, perfectBonus, onFinish(score,total), again, instant(默认 true), timer(bool)} */
  function MCQ(root, items, opts) {
    opts = opts || {};
    var i = 0, score = 0, log = [], t0 = Date.now(), tick;
    function dots() { return items.map(function (_, n) { return '<i class="' + (n < i ? (log[n] && log[n].ok ? 'r' : 'w') : n === i ? 'c' : '') + '"></i>'; }).join(''); }
    function draw() {
      if (i >= items.length) return finish();
      var it = items[i];
      var order = B.shuffle(it.options.map(function (_, n) { return n; }));
      root.innerHTML = '<div class="quiz mcq">' +
        '<div class="q-top"><div class="dots' + (items.length > 15 ? ' many' : '') + '">' + dots() + '</div><span class="muted small num">' + (opts.timer ? '<span class="clock" id="mcq-clock">0:00</span>　' : '') + (i + 1) + ' / ' + items.length + '</span></div>' +
        (it.tag ? '<span class="tag">' + esc(it.tag) + '</span>' : '') +
        '<div class="q-text" lang="ja">' + mark(it.q) + (it.say ? ' ' + sayBtn(it.say, '', it.sayKey) : '') + '</div>' +
        (it.hint ? '<p class="muted small" style="margin:0">' + it.hint + '</p>' : '') +
        '<div class="q-opts text">' + order.map(function (n) { return '<button type="button" class="opt" lang="ja" data-n="' + n + '">' + it.options[n] + '</button>'; }).join('') + '</div>' +
        '<div class="feedback" aria-live="polite">' + B.jelly('think') + '<span class="muted">选一个答案吧</span></div></div>';
      if (opts.timer) startClock();
      $$('.opt', root).forEach(function (b) {
        b.onclick = function () {
          var n = +b.getAttribute('data-n'), ok = n === it.answer;
          $$('.opt', root).forEach(function (x) { x.disabled = true; if (+x.getAttribute('data-n') === it.answer) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong'); else score++;
          log[i] = { ok: ok, pick: n, it: it };
          if (ok && opts.xpPer) B.addXP(opts.xpPer);
          $('.feedback', root).innerHTML = B.jelly(ok ? 'right' : 'wrong') + '<span><b>' + (ok ? '正解！' : '正确答案：' + plain(it.options[it.answer])) + '</b>' + (it.why ? '<br><span class="muted small">' + it.why + '</span>' : '') + '</span>' +
            '<button class="btn btn-sky btn-small" type="button" data-next style="margin-left:auto">' + (i + 1 < items.length ? '下一题' : '看结果') + '</button>';
          var nx = $('[data-next]', root); nx.onclick = function () { i++; draw(); }; nx.focus({ preventScroll: true });
        };
      });
    }
    function startClock() {
      clearInterval(tick);
      var c = function () { var e = $('#mcq-clock', root); if (!e) return clearInterval(tick); var s = Math.floor((Date.now() - t0) / 1000); e.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); };
      c(); tick = setInterval(c, 1000);
    }
    function finish() {
      clearInterval(tick);
      var total = items.length, perfect = score === total, bonus = (opts.bonus || 0) + (perfect ? (opts.perfectBonus || 0) : 0);
      var secs = Math.floor((Date.now() - t0) / 1000);
      if (bonus) B.addXP(bonus, opts.title || '完成练习');
      if (opts.onFinish) opts.onFinish(score, total, secs);
      var wrong = log.filter(function (l) { return !l.ok; });
      root.innerHTML = '<div class="quiz" style="align-items:center;text-align:center">' +
        B.jelly(perfect ? 'right' : score >= total * .6 ? 'happy' : 'think').replace('<svg', '<svg style="width:84px;height:118px"') +
        '<h3 style="font-size:1.5rem">' + score + ' / ' + total + (perfect ? '　全对！' : '') + '</h3>' +
        '<p class="muted" style="margin:0">' + (opts.timer ? '用时 ' + Math.floor(secs / 60) + ' 分 ' + secs % 60 + ' 秒　' : '') + (bonus ? '本轮奖励 +' + bonus + ' 经验值' : '') + '</p>' +
        (wrong.length ? '<div class="review"><p style="margin:8px 0 6px;font-weight:900">错题回顾</p>' + wrong.map(function (w) {
          return '<div class="rv"><div lang="ja">' + mark(w.it.q) + '</div><div class="small"><span class="bad">你的答案：' + w.it.options[w.pick] + '</span>　<span class="good">正确：' + w.it.options[w.it.answer] + '</span></div>' + (w.it.why ? '<div class="muted small">' + w.it.why + '</div>' : '') + '</div>';
        }).join('') + '</div>' : '') +
        '<div class="hero-cta" style="justify-content:center"><button class="btn btn-sun" type="button" data-again>再来一轮</button></div></div>';
      $('[data-again]', root).onclick = function () { if (opts.again) opts.again(); else { i = 0; score = 0; log = []; t0 = Date.now(); items = B.shuffle(items); draw(); } };
    }
    draw();
  }

  /* 小型标签切换：buttons[data-tab] 对应 panel[data-panel] */
  function tabs(bar, onPick) {
    $$('[data-tab]', bar).forEach(function (b) {
      b.onclick = function () {
        $$('[data-tab]', bar).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        onPick(b.getAttribute('data-tab'));
      };
    });
  }

  /* 让首页的 #锚点 在页面渲染完后也能对准 */
  window.addEventListener('load', function () { if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el && !el.closest('.tabpanel[hidden]')) setTimeout(function () { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90 }); }, 60); } });

  B.study = { rb: rb, plain: plain, mark: mark, sayBtn: sayBtn, toggles: toggles, store: store, best: best, MCQ: MCQ, tabs: tabs };
})();
