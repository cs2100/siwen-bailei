/* 明暗主题 */
(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

/* 简体 ⇄ 正体（繁体）：在浏览器里用 OpenCC 实时转换，文章只需写简体。
   转换库 1MB 左右，点了"繁"才会下载；选择记在浏览器里，换页保持。 */
(function () {
  var btn = document.querySelector('.lang-toggle');
  if (!btn) return;
  var root = document.documentElement, KEY = 'lang', conv = null;
  var ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
  var ATTR_SEL = ATTRS.map(function (a) { return '[' + a + ']'; }).join(',');

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {} }

  function skip(node) {
    for (var e = node.parentElement; e; e = e.parentElement) {
      if (/^(SCRIPT|STYLE|TEXTAREA)$/.test(e.tagName) || e.classList.contains('ignore-opencc')) return true;
    }
    return false;
  }
  function convText(n) {
    if (!n.nodeValue.trim() || skip(n)) return;
    var v = conv(n.nodeValue);
    if (v !== n.nodeValue) n.nodeValue = v;
  }
  function convAttrs(el) {
    if (el.classList.contains('ignore-opencc')) return;
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a);
      if (v) { var c = conv(v); if (c !== v) el.setAttribute(a, c); }
    });
  }
  function convTree(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) convText(n);
    if (el.matches && el.matches(ATTR_SEL)) convAttrs(el);
    el.querySelectorAll(ATTR_SEL).forEach(convAttrs);
  }
  function addNode(n) {
    if (n.nodeType === 3) convText(n);
    else if (n.nodeType === 1) convTree(n);
  }

  function load(done) {
    if (window.OpenCC) return done();
    var s = document.createElement('script');
    s.src = btn.getAttribute('data-src');
    s.onload = done;
    s.onerror = function () { root.classList.remove('zh-wait'); set(null); };
    document.head.appendChild(s);
  }
  function enable() {
    load(function () {
      conv = OpenCC.Converter({ from: 'cn', to: btn.getAttribute('data-variant') || 'tw' });
      root.lang = 'zh-TW';
      convTree(document.body);
      document.title = conv(document.title);
      btn.textContent = '简';
      btn.setAttribute('title', '切换为简体');
      btn.setAttribute('aria-label', '切换为简体');
      new MutationObserver(function (ms) {
        ms.forEach(function (m) { m.addedNodes.forEach(addNode); });
      }).observe(document.body, { childList: true, subtree: true });
      root.classList.remove('zh-wait');
    });
  }

  btn.addEventListener('click', function () {
    if (get() === 'hant') { set(null); location.reload(); }
    else { set('hant'); enable(); }
  });
  if (get() === 'hant') enable();
})();
