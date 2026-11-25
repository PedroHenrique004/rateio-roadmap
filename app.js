(function () {
  'use strict';
  var R = window.ROADMAP;
  var app = document.getElementById('app');
  var KEY = 'roadmap:progress:v1';

  /* ---------- progresso (localStorage, com tolerância a falhas) ---------- */
  var state = { checks: {}, done: {}, answers: {}, custom: {} };
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw);
  } catch (e) {}
  state.checks = state.checks || {};
  state.done = state.done || {};
  state.answers = state.answers || {};
  state.custom = state.custom || {};
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ---------- utilitários ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // `código` entre crases vira <code>
  function rich(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>'); }
  function phaseOf(m) { return R.phases.filter(function (p) { return p.id === m.phase; })[0]; }
  function keysOf(m) {
    var k = [];
    m.objectives.forEach(function (_, i) { k.push(m.id + ':o' + i); });
    m.challenge.steps.forEach(function (_, i) { k.push(m.id + ':s' + i); });
    m.challenge.done.forEach(function (_, i) { k.push(m.id + ':d' + i); });
    return k;
  }
  function progressOf(m) {
    var keys = keysOf(m);
    var n = keys.filter(function (k) { return state.checks[k]; }).length;
    var answered = m.guiding.filter(function (_, i) { return (state.answers[m.id + ':g' + i] || '').trim(); }).length;
    n += answered;
    var total = keys.length + m.guiding.length;
    return { n: n, total: total, pct: total ? n / total : 0 };
  }
  function doneCount() { return R.modules.filter(function (m) { return state.done[m.id]; }).length; }
  function linkHtml(key) {
    var l = R.links[key];
    return l ? '<a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + '</a>' : '';
  }
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------- tema e diálogo ---------- */
  document.getElementById('theme').addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('roadmap:theme', next); } catch (e) {}
  });
  var dlg = document.getElementById('cbl');
  document.getElementById('open-cbl').addEventListener('click', function () {
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  });

  /* ---------- Markdown para colar no Notion ---------- */
  function toMarkdown(m) {
    var L = [];
    L.push('# Módulo ' + m.id + ' · ' + m.title);
    L.push('_' + m.subtitle + '_  ·  Versão: ' + m.version);
    L.push('', '## Engajar');
    L.push('- **Ideia central:** ' + m.engage.bigIdea);
    L.push('- **Pergunta essencial:** ' + m.engage.question);
    L.push('- **Desafio:** ' + m.engage.challenge);
    L.push('', '## Objetivos de aprendizado');
    m.objectives.forEach(function (o) { L.push('- [ ] ' + o); });
    L.push('', '## Investigar · perguntas-guia');
    m.guiding.forEach(function (q, i) {
      L.push('- ' + q);
      var a = (state.answers[m.id + ':g' + i] || '').trim();
      if (a) L.push('  - Minha resposta: ' + a.replace(/\n+/g, ' '));
    });
    (state.custom[m.id] || []).forEach(function (c) {
      L.push('- ' + c.q + ' (minha pergunta)');
      if ((c.a || '').trim()) L.push('  - Minha resposta: ' + c.a.trim().replace(/\n+/g, ' '));
    });
    L.push('', '## Estudar');
    m.study.forEach(function (s) {
      L.push('### ' + s.title);
      s.points.forEach(function (p) { L.push('- ' + p); });
      (s.links || []).forEach(function (k) { if (R.links[k]) L.push('- Recurso: [' + R.links[k].label + '](' + R.links[k].url + ')'); });
    });
    L.push('', '## Agir · ' + m.challenge.title);
    L.push(m.challenge.brief, '', '### Passos');
    m.challenge.steps.forEach(function (s) { L.push('- [ ] ' + s); });
    L.push('', '### Pronto quando');
    m.challenge.done.forEach(function (s) { L.push('- [ ] ' + s); });
    L.push('', '**Para ir além:** ' + m.challenge.stretch);
    L.push('', '### Reflexão');
    m.challenge.reflect.forEach(function (q) { L.push('- ' + q); });
    return L.join('\n');
  }
  function copyText(text) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      toast(ok ? 'Copiado! Cole no Notion.' : 'Não consegui copiar. Selecione e copie manualmente.');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast('Copiado! Cole no Notion.'); }, fallback);
    } else { fallback(); }
  }

  /* ---------- Home ---------- */
  function renderHome() {
    var total = R.modules.length;
    var done = doneCount();
    var C = 2 * Math.PI * 78;
    var next = R.modules.filter(function (m) { return !state.done[m.id]; })[0];
    var started = done > 0 || Object.keys(state.checks).some(function (k) { return state.checks[k]; });

    var html = '';
    html += '<section class="hero"><div>' +
      '<div class="eyebrow"><span class="tag">13 módulos</span> Challenge Based Learning</div>' +
      '<h1>Do Swift ao <em>KMP</em>, construindo o Rateio.</h1>' +
      '<p class="lead">Um caminho de estudos em ciclos curtos. Cada módulo começa com uma pergunta, passa pelo que você precisa estudar e termina com um desafio que vira código no app.</p>' +
      '<div class="cta-row">' +
      (next ? '<a class="btn" href="#/m/' + next.id + '">' + (started ? 'Continuar: módulo ' + next.id : 'Começar pelo módulo 0') + '</a>' : '<a class="btn" href="#/m/0">Revisar do início</a>') +
      '<button class="btn ghost" type="button" id="hero-cbl">Como funciona o CBL</button>' +
      '</div></div>' +
      '<div class="ring" role="img" aria-label="' + done + ' de ' + total + ' desafios concluídos">' +
      '<svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">' +
      '<circle class="track" cx="90" cy="90" r="78" fill="none" stroke-width="14"/>' +
      '<circle class="bar" cx="90" cy="90" r="78" fill="none" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - done / total)).toFixed(1) + '"/>' +
      '</svg><div class="ring-label"><div><b>' + done + '/' + total + '</b><br><span>desafios</span></div></div></div></section>';

    html += '<section class="cbl-strip" aria-label="As três fases do ciclo">' +
      step(1, 'Engajar', 'Ideia central, pergunta essencial e o desafio que vira o objetivo.', '#4A58C7') +
      step(2, 'Investigar', 'Perguntas-guia e o conteúdo exato para estudar, sem excesso.', '#2B8570') +
      step(3, 'Agir', 'Construa, confira com critérios claros de "pronto" e reflita.', '#B84F73') +
      '</section>';

    R.phases.forEach(function (p) {
      var mods = R.modules.filter(function (m) { return m.phase === p.id; });
      html += '<section class="phase" style="--accent:' + p.color + '"><div class="phase-head"><h2><span class="phase-dot" style="background:' + p.color + '"></span>' + esc(p.name) + '</h2><p>' + esc(p.blurb) + '</p></div><div class="grid">';
      mods.forEach(function (m) {
        var pr = progressOf(m);
        html += '<a class="card" href="#/m/' + m.id + '" style="--accent:' + p.color + '">' +
          '<span class="num" aria-hidden="true">' + m.id + '</span>' +
          '<span class="emoji" aria-hidden="true">' + m.emoji + '</span>' +
          '<h3>' + esc(m.title) + '</h3><p>' + esc(m.subtitle) + '</p>' +
          '<div class="card-foot"><span class="tag">' + esc(m.version) + '</span>' +
          '<span class="mini" aria-hidden="true"><i style="width:' + Math.round(pr.pct * 100) + '%"></i></span>' +
          (state.done[m.id] ? '<span class="done-badge">✓ feito</span>' : '<span>' + pr.n + '/' + pr.total + '</span>') + '</div></a>';
      });
      html += '</div></section>';
    });

    html += '<p class="foot">Seu progresso fica salvo só neste navegador. Os links externos podem mudar: confirme na documentação oficial.</p>';
    app.innerHTML = html;
    var hc = document.getElementById('hero-cbl');
    if (hc) hc.addEventListener('click', function () { document.getElementById('open-cbl').click(); });
  }
  function step(n, title, text, color) {
    return '<div class="cbl-step"><div class="n" style="background:' + color + '">' + n + '</div><h3>' + title + '</h3><p>' + text + '</p></div>';
  }

  /* ---------- Módulo ---------- */
  function renderModule(id) {
    var m = R.modules.filter(function (x) { return x.id === id; })[0];
    if (!m) { location.hash = '#/'; return; }
    var p = phaseOf(m);
    var idx = R.modules.indexOf(m);
    var prev = R.modules[idx - 1], nxt = R.modules[idx + 1];

    function checks(prefix, list) {
      return '<ul class="checks">' + list.map(function (t, i) {
        var k = m.id + ':' + prefix + i;
        return '<li><label class="check"><input type="checkbox" data-k="' + k + '"' + (state.checks[k] ? ' checked' : '') + '><span>' + rich(t) + '</span></label></li>';
      }).join('') + '</ul>';
    }

    var h = '<a class="crumb" href="#/">← Todos os módulos</a>';
    h += '<header class="m-hero" style="--accent:' + p.color + '" data-num="' + m.id + '">' +
      '<div class="emoji" aria-hidden="true">' + m.emoji + '</div>' +
      '<h1 id="mt" tabindex="-1">' + esc(m.title) + '</h1><p>' + esc(m.subtitle) + '</p>' +
      '<div class="m-meta"><span class="tag">' + esc(m.version) + '</span><span>' + esc(p.name) + '</span><span>esforço ' + esc(m.effort) + '</span></div></header>';

    h += '<div style="--accent:' + p.color + '">';
    h += '<nav class="stepper" aria-label="Fases do módulo"><a href="#/m/' + m.id + '" data-s="engajar">1 · Engajar</a><a href="#/m/' + m.id + '" data-s="investigar">2 · Investigar</a><a href="#/m/' + m.id + '" data-s="agir">3 · Agir</a></nav>';

    /* Engajar */
    h += '<section class="sec" id="engajar"><div class="sec-label"><b>1</b> Engajar</div><h2>Por que isto importa</h2><p class="hint">Leia as três ideias e marque o que você quer aprender neste módulo.</p>' +
      '<div class="trio">' +
      '<div class="panel"><h3>Ideia central</h3><p>' + esc(m.engage.bigIdea) + '</p></div>' +
      '<div class="panel q"><h3>Pergunta essencial</h3><p>' + esc(m.engage.question) + '</p></div>' +
      '<div class="panel"><h3>Desafio</h3><p>' + esc(m.engage.challenge) + '</p></div></div>' +
      '<h3 class="sub">Objetivos de aprendizado</h3>' + checks('o', m.objectives) + '</section>';

    /* Investigar */
    h += '<section class="sec" id="investigar"><div class="sec-label"><b>2</b> Investigar</div><h2>O que estudar</h2>' +
      '<p class="hint">Responda com as suas palavras. O texto é salvo sozinho neste navegador.</p>' +
      '<h3 class="sub">Perguntas-guia <span class="count" id="ans-count"></span></h3>' +
      '<div class="qa-list">' + m.guiding.map(function (q, i) {
        var k = m.id + ':g' + i;
        return '<div class="qa"><label for="a' + k.replace(':', '-') + '" class="qa-q"><span class="qmark" aria-hidden="true">?</span><span>' + esc(q) + '</span></label>' +
          '<textarea id="a' + k.replace(':', '-') + '" data-a="' + k + '" rows="2" placeholder="Sua resposta…">' + esc(state.answers[k] || '') + '</textarea></div>';
      }).join('') + '</div>' +
      '<h3 class="sub">Minhas perguntas</h3>' +
      '<p class="hint">Escreveu uma dúvida enquanto estudava? Registre aqui e responda quando descobrir.</p>' +
      '<div id="custom-list" class="qa-list"></div>' +
      '<form class="add-q" id="add-q"><input type="text" id="new-q" placeholder="Escreva uma pergunta sua…" maxlength="240" aria-label="Nova pergunta"><button class="btn small" type="submit">Adicionar</button></form>';
    h += '<div class="study">' + m.study.map(function (s) {
      return '<div class="panel"><h3 class="st">' + esc(s.title) + '</h3><ul>' +
        s.points.map(function (t) { return '<li>' + rich(t) + '</li>'; }).join('') + '</ul>' +
        (s.links ? '<div class="links">' + s.links.map(linkHtml).join('') + '</div>' : '') + '</div>';
    }).join('') + '</div>';
    if (m.bridge) {
      h += '<div class="bridge"><h3>Ponte Swift → Kotlin</h3><div class="brow head"><span>Swift / SwiftUI</span><span>Kotlin / Compose</span><span>Nota</span></div>' +
        m.bridge.map(function (r) { return '<div class="brow"><code>' + esc(r[0]) + '</code><code>' + esc(r[1]) + '</code><span class="note">' + esc(r[2]) + '</span></div>'; }).join('') + '</div>';
    }
    h += '</section>';

    /* Agir */
    var c = m.challenge;
    h += '<section class="sec" id="agir"><div class="sec-label"><b>3</b> Agir</div>' +
      '<article class="challenge"><div class="ch-head"><div class="eyebrow" style="color:inherit;opacity:.85;margin:0">Desafio</div><h2>' + esc(c.title) + '</h2><p>' + esc(c.brief) + '</p></div>' +
      '<div class="ch-body">' +
      '<div><h3>Passos</h3>' + checks('s', c.steps) + '</div>' +
      '<div><h3>Pronto quando</h3>' + checks('d', c.done) + '</div>' +
      '<div class="stretch"><b>Para ir além:</b> ' + esc(c.stretch) + '</div>' +
      '<div><h3>Reflexão</h3><ul class="reflect">' + c.reflect.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="ch-actions"><button class="btn' + (state.done[m.id] ? ' done' : '') + '" type="button" id="finish">' + (state.done[m.id] ? '✓ Desafio concluído' : 'Marcar desafio como concluído') + '</button>' +
      '<button class="btn ghost" type="button" id="copy">Copiar para o Notion (Markdown)</button></div>' +
      '</div></article></section></div>';

    h += '<nav class="pager" aria-label="Navegar entre módulos">' +
      (prev ? '<a class="prev" href="#/m/' + prev.id + '"><small>← Anterior</small><b>' + esc(prev.title) + '</b></a>' : '<span></span>') +
      (nxt ? '<a class="next" href="#/m/' + nxt.id + '"><small>Próximo →</small><b>' + esc(nxt.title) + '</b></a>' : '') + '</nav>';

    app.innerHTML = h;

    app.querySelectorAll('input[data-k]').forEach(function (el) {
      el.addEventListener('change', function () { state.checks[el.getAttribute('data-k')] = el.checked; save(); });
    });
    document.getElementById('finish').addEventListener('click', function () {
      state.done[m.id] = !state.done[m.id]; save();
      this.classList.toggle('done', !!state.done[m.id]);
      this.textContent = state.done[m.id] ? '✓ Desafio concluído' : 'Marcar desafio como concluído';
      toast(state.done[m.id] ? 'Desafio concluído. Bom trabalho!' : 'Desafio reaberto.');
    });
    document.getElementById('copy').addEventListener('click', function () { copyText(toMarkdown(m)); });

    /* perguntas e respostas */
    function grow(el) { el.style.height = 'auto'; el.style.height = Math.max(el.scrollHeight, 64) + 'px'; }
    function updateCount() {
      var n = m.guiding.filter(function (_, i) { return (state.answers[m.id + ':g' + i] || '').trim(); }).length;
      var el = document.getElementById('ans-count');
      if (el) el.textContent = n + ' de ' + m.guiding.length + ' respondidas';
    }
    var timer;
    app.querySelectorAll('textarea[data-a]').forEach(function (ta) {
      grow(ta);
      ta.addEventListener('input', function () {
        grow(ta);
        state.answers[ta.getAttribute('data-a')] = ta.value;
        updateCount();
        clearTimeout(timer); timer = setTimeout(save, 300);
      });
    });
    updateCount();

    function renderCustom() {
      var list = state.custom[m.id] || [];
      var box = document.getElementById('custom-list');
      box.innerHTML = list.map(function (c, i) {
        return '<div class="qa"><div class="qa-q"><span class="qmark mine" aria-hidden="true">?</span><span>' + esc(c.q) + '</span>' +
          '<button type="button" class="x" data-del="' + i + '" aria-label="Remover pergunta">×</button></div>' +
          '<textarea data-c="' + i + '" rows="2" placeholder="Sua resposta…" aria-label="Resposta da pergunta ' + (i + 1) + '">' + esc(c.a || '') + '</textarea></div>';
      }).join('');
      box.querySelectorAll('textarea[data-c]').forEach(function (ta) {
        grow(ta);
        ta.addEventListener('input', function () {
          grow(ta);
          list[parseInt(ta.getAttribute('data-c'), 10)].a = ta.value;
          clearTimeout(timer); timer = setTimeout(save, 300);
        });
      });
      box.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (!confirm('Remover esta pergunta e a resposta?')) return;
          list.splice(parseInt(b.getAttribute('data-del'), 10), 1);
          state.custom[m.id] = list; save(); renderCustom();
        });
      });
    }
    renderCustom();
    document.getElementById('add-q').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var inp = document.getElementById('new-q');
      var q = inp.value.trim();
      if (!q) return;
      (state.custom[m.id] = state.custom[m.id] || []).push({ q: q, a: '' });
      inp.value = ''; save(); renderCustom();
      var tas = document.querySelectorAll('#custom-list textarea');
      if (tas.length) tas[tas.length - 1].focus();
    });

    // destaca a fase visível no stepper
    var links = app.querySelectorAll('.stepper a');
    links.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        document.getElementById(a.getAttribute('data-s')).scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-s') === e.target.id); });
          }
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      ['engajar', 'investigar', 'agir'].forEach(function (s) { io.observe(document.getElementById(s)); });
    }
  }

  /* ---------- rotas ---------- */
  function route(first) {
    var h = location.hash || '#/';
    var mt = /^#\/m\/(\d+)$/.exec(h);
    if (mt) renderModule(parseInt(mt[1], 10)); else renderHome();
    if (!first) { window.scrollTo(0, 0); }
    var t = document.getElementById('mt') || app;
    t.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', function () { route(false); });
  route(true);
})();
