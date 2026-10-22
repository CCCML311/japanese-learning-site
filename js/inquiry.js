/* 咨询：一个共享的弹出卡片表单（Breeze.inquiry(type)）。
   type：course（课程 / 预约试听，默认）、interpret（口译）、other（其他问题）。
   页面上任何带 data-inquiry 的按钮或链接都会打开它；about.html?ask=1&type=interpret 进入页面时自动打开。
   页面里如果还有老式的 form[data-type]，也照样能提交。
   type=bug 是「报告问题」：单独的表单，自动附上页面地址、设备信息和最近的脚本报错。 */
(function () {
  var TYPES = [['course', '课程 / 试听'], ['interpret', '口译'], ['other', '其他问题']];
  var LEAD = {
    course: '留下联系方式和你的情况，あお老师会在 1–2 天内联系你，约 30 分钟免费试听。',
    interpret: '写下场景、日期和地点，あお老师会在 1–2 天内回复能不能接、需要准备什么。',
    other: '版权、隐私、退款、合作或网站使用上的问题，都可以在这里留言。',
    bug: '页面显示不对、按钮没反应、读音或释义有错，都可以告诉我们。页面地址和设备信息会自动附上，不用自己填。'
  };
  function pageRef() {
    var here = location.pathname.split('/').pop() || 'index.html';
    if (/^about\.html/.test(here) && /[?&]type=bug/.test(location.search) && document.referrer) { try { var u = new URL(document.referrer); if (u.origin === location.origin) return u.pathname.split('/').pop() + u.hash; } catch (e) { } }
    return here + location.hash;
  }
  function fields(type) {
    if (type === 'bug') return '' +
      '<div class="field"><label for="q-kind">遇到了什么问题</label><select id="q-kind" name="kind"><option>页面显示不正常</option><option>按钮或功能用不了</option><option>读音、释义或例句有错</option><option>游戏或进度出问题</option><option>其他</option></select></div>' +
      '<div class="field"><label for="q-page">在哪个页面</label><input id="q-page" name="page" maxlength="120" value="' + window.Breeze.esc(pageRef()) + '"></div>' +
      '<div class="field full"><label for="q-msg">具体是怎么回事</label><textarea id="q-msg" name="message" maxlength="1000" placeholder="例如：单词页背 N3 时，点「下一个」没有反应；或者「食べる」的读音读成了……"></textarea></div>' +
      '<div class="field full"><label for="q-contact">微信号或邮箱（选填，想知道修好了没可以留）</label><input id="q-contact" name="contact" maxlength="60"></div>';
    if (type === 'interpret') return '' +
      '<div class="field"><label for="q-name">怎么称呼你 / 公司名</label><input id="q-name" name="name" maxlength="30" autocomplete="nickname"></div>' +
      '<div class="field"><label for="q-contact">微信号或邮箱</label><input id="q-contact" name="contact" maxlength="60"></div>' +
      '<div class="field"><label for="q-field">场景</label><select id="q-field" name="field"><option>商务洽谈 / 工厂参观</option><option>展会</option><option>学术会议 / 交流</option><option>旅游陪同</option><option>线上会议</option><option>其他</option></select></div>' +
      '<div class="field"><label for="q-date">日期（大概也可以）</label><input id="q-date" name="date" maxlength="40" placeholder="例如：11 月中旬，2 天"></div>' +
      '<div class="field full"><label for="q-msg">地点、内容和其他要求</label><textarea id="q-msg" name="message" maxlength="1000" placeholder="例如：上海，日方客户来参观工厂，内容是数控机床，需要半天陪同"></textarea></div>';
    if (type === 'other') return '' +
      '<div class="field"><label for="q-name">怎么称呼你</label><input id="q-name" name="name" maxlength="30" autocomplete="nickname"></div>' +
      '<div class="field"><label for="q-contact">微信号或邮箱</label><input id="q-contact" name="contact" maxlength="60"></div>' +
      '<div class="field full"><label for="q-topic">关于什么</label><select id="q-topic" name="topic"><option>版权</option><option>隐私</option><option>退款</option><option>合作</option><option>网站使用</option><option>其他</option></select></div>' +
      '<div class="field full"><label for="q-msg">具体内容</label><textarea id="q-msg" name="message" maxlength="1000" placeholder="请尽量写清楚，方便老师直接处理"></textarea></div>';
    return '' +
      '<div class="field"><label for="q-name">怎么称呼你</label><input id="q-name" name="name" maxlength="30" autocomplete="nickname"></div>' +
      '<div class="field"><label for="q-contact">微信号或邮箱</label><input id="q-contact" name="contact" maxlength="60"></div>' +
      '<div class="field"><label for="q-course">想上的课程</label><select id="q-course" name="course"><option>JLPT 考级</option><option>商务日语</option><option>口语会话</option><option>留学准备</option><option>还没想好</option></select></div>' +
      '<div class="field"><label for="q-level">现在的日语水平</label><select id="q-level" name="level"><option>零基础</option><option>会五十音</option><option>N5–N4</option><option>N3</option><option>N2 及以上</option></select></div>' +
      '<div class="field full"><label for="q-msg">你的目标和方便上课的时间</label><textarea id="q-msg" name="message" maxlength="1000" placeholder="例如：明年 7 月想考 N2，工作日晚上 8 点后有空"></textarea></div>';
  }

  /* 提交逻辑：弹窗表单和老式页面表单共用 */
  function bindForm(form, getType) {
    var B = window.Breeze;
    var msg = form.querySelector('.form-msg');
    function say(t, ok) { msg.textContent = t; msg.className = 'form-msg ' + (ok ? 'ok' : 'err'); if (t && msg.scrollIntoView) msg.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = {}; B.$$('[name]', form).forEach(function (el) { fd[el.name] = el.type === 'checkbox' ? el.checked : el.value.trim(); });
      var type = getType();
      if (type === 'bug') {
        if (!fd.message || fd.message.length < 5) return say('请简单描述一下问题（至少 5 个字）');
        if (fd.contact && !fd.agree) return say('留了联系方式的话，请先勾选同意隐私政策');
        fd.name = fd.name || '网站用户'; fd.contact = fd.contact || '未留联系方式';
        var errs = (window.__breezeErrors || []).slice(-3).join(' | ');
        fd.message = ('【报告问题：' + (fd.kind || '其他') + '】\n页面：' + (fd.page || pageRef()) + '\n设备：' + navigator.userAgent.slice(0, 160) + ' · 窗口 ' + window.innerWidth + '×' + window.innerHeight + (errs ? '\n最近报错：' + errs.slice(0, 300) : '') + '\n\n' + fd.message);
      } else {
      if (!fd.name) return say('请填写怎么称呼你');
      if (!fd.contact || fd.contact.length < 5) return say('请留下微信号或邮箱，方便老师联系你');
      if (!fd.message || fd.message.length < 5) return say('请简单说说你的需求（至少 5 个字）');
      if (!fd.agree) return say('请先勾选同意隐私政策');
      }
      /* 后端只认 course / interpret：「其他问题」按 course 提交，内容开头注明主题 */
      var payload = { type: type === 'interpret' ? 'interpret' : 'course', name: fd.name.slice(0, 30), contact: fd.contact.slice(0, 60), message: fd.message.slice(0, 1000) };
      if (fd.course) payload.course = fd.course; if (fd.field) payload.field = fd.field; if (fd.date) payload.date = fd.date;
      if (fd.level) payload.message = '【当前水平】' + fd.level + '\n' + payload.message;
      if (type === 'bug') payload.course = '报告问题';
      if (type === 'other') { payload.course = '其他问题'; payload.message = ('【其他问题：' + (fd.topic || '其他') + '】\n' + payload.message).slice(0, 1000); }
      var btn = form.querySelector('[type=submit]'); btn.disabled = true; say('正在提交…', true);
      B.API.submitInquiry(payload).then(function (r) {
        btn.disabled = false;
        if (r.ok) { form.reset(); say(type === 'bug' ? '谢谢反馈！我们会尽快检查和修复。' : '已收到！あお老师会在 1–2 天内通过你留下的方式联系你。', true); B.toast('提交成功'); }
        else if (r.error === 'demo') say('预览模式：后端还没连接，这次提交没有发出。网站上线后即可正常使用。');
        else say('提交失败：' + (r.error || '请稍后再试'));
      });
    });
  }

  function addStyle() {
    if (document.getElementById('iq-style')) return;
    var st = document.createElement('style'); st.id = 'iq-style';
    st.textContent = '.iq-seg{flex:none;display:flex;width:100%;box-sizing:border-box}.iq-seg button{flex:1 0 auto;text-align:center;min-height:40px;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center}.iq-form{flex:none}';
    document.head.appendChild(st);
  }
  function inquiry(type) {
    var B = window.Breeze; addStyle();
    var isBug = type === 'bug';
    type = type === 'interpret' || type === 'other' || isBug ? type : 'course';
    B.sheet(isBug ? '报告问题' : '预约试听 / 咨询', function (body) {
      body.innerHTML = '<div class="seg iq-seg" role="group" aria-label="咨询类型"' + (isBug ? ' hidden' : '') + '>' +
        TYPES.map(function (t) { return '<button type="button" data-t="' + t[0] + '" aria-pressed="' + (t[0] === type) + '">' + t[1] + '</button>'; }).join('') + '</div>' +
        '<p class="muted iq-lead" style="margin:0"></p>' +
        (function () { var S = window.BREEZE_SITE || {}; return (S.contactEmail || S.wechat) && !isBug ? '<p class="small muted" style="margin:0">也可以直接联系：' + (S.contactEmail ? '邮箱 <a href="mailto:' + B.esc(S.contactEmail) + '">' + B.esc(S.contactEmail) + '</a>' : '') + (S.contactEmail && S.wechat ? '　' : '') + (S.wechat ? '微信 ' + B.esc(S.wechat) : '') + '</p>' : ''; })() +
        '<form class="form iq-form" novalidate><div class="iq-fields" style="display:contents"></div>' +
        '<label class="check full"><input type="checkbox" name="agree"><span>我同意按<a href="policies.html#privacy" target="_blank">隐私政策</a>处理我留下的联系方式，仅用于这次' + (isBug ? '反馈' : '咨询') + '</span></label>' +
        '<div class="full" style="display:flex;flex-wrap:wrap;gap:12px;align-items:center"><button class="btn btn-sun" type="submit">' + (isBug ? '提交反馈' : '提交咨询') + '</button><p class="form-msg" aria-live="polite" style="margin:0"></p></div></form>';
      var form = body.querySelector('.iq-form');
      function render(t) {
        type = t;
        B.$$('.iq-seg button', body).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-t') === t ? 'true' : 'false'); });
        body.querySelector('.iq-lead').textContent = LEAD[t];
        /* 切换类型时保留已经填好的称呼、联系方式和留言 */
        var keep = {}; ['name', 'contact', 'message'].forEach(function (n) { var el = form.querySelector('[name=' + n + ']'); if (el) keep[n] = el.value; });
        form.querySelector('.iq-fields').innerHTML = fields(t);
        for (var n in keep) { var el = form.querySelector('[name=' + n + ']'); if (el) el.value = keep[n]; }
        var m = form.querySelector('.form-msg'); m.textContent = ''; m.className = 'form-msg';
      }
      B.$$('.iq-seg button', body).forEach(function (b) { b.addEventListener('click', function () { render(b.getAttribute('data-t')); }); });
      render(type);
      bindForm(form, function () { return type; });
    });
  }

  function boot() {
    var B = window.Breeze; if (B.inquiry) return; 
    B.inquiry = inquiry;
    B.$$('form[data-type]').forEach(function (form) { bindForm(form, function () { return form.getAttribute('data-type'); }); });
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-inquiry]'); if (!a) return;
      e.preventDefault(); inquiry(a.getAttribute('data-inquiry'));
    });
    var q = new URLSearchParams(location.search);
    if (q.get('ask')) setTimeout(function () { inquiry(q.get('type')); }, 60);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
