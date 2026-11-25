/* Sincronização do progresso com o Supabase (banco Postgres) e regras puras de decisão.
   Funciona offline: o navegador continua salvando localmente e envia quando há login. */
(function (root) {
  'use strict';

  /* ---------- regras puras (testadas em Node) ---------- */
  function normalize(s) {
    s = s && typeof s === 'object' ? s : {};
    return {
      checks: s.checks && typeof s.checks === 'object' ? s.checks : {},
      done: s.done && typeof s.done === 'object' ? s.done : {},
      answers: s.answers && typeof s.answers === 'object' ? s.answers : {},
      custom: s.custom && typeof s.custom === 'object' ? s.custom : {},
    };
  }

  function isEmpty(s) {
    s = normalize(s);
    var any = false;
    Object.keys(s.checks).forEach(function (k) { if (s.checks[k]) any = true; });
    Object.keys(s.done).forEach(function (k) { if (s.done[k]) any = true; });
    Object.keys(s.answers).forEach(function (k) { if ((s.answers[k] || '').trim()) any = true; });
    Object.keys(s.custom).forEach(function (k) { if ((s.custom[k] || []).length) any = true; });
    return !any;
  }

  /* Decide o que fazer ao comparar este computador (meta/local) com a nuvem (remote).
     meta: { synced: ISO da última versão da nuvem que este computador viu, dirty: há mudanças não enviadas }
     remote: null (nada na nuvem) ou { updated_at, data } */
  function decide(meta, remote, local) {
    meta = meta || {};
    if (!remote) return isEmpty(local) && !meta.dirty ? 'none' : 'push';
    if (!meta.synced) return isEmpty(local) ? 'pull' : 'conflict';
    if (new Date(remote.updated_at) > new Date(meta.synced)) return meta.dirty ? 'conflict' : 'pull';
    return meta.dirty ? 'push' : 'none';
  }

  /* Junta dois estados sem perder nada: marcações valem se estiverem em qualquer um;
     respostas diferentes ficam as duas, separadas; perguntas próprias são unidas pelo texto. */
  function merge(a, b) {
    a = normalize(a); b = normalize(b);
    var out = normalize({});
    [a, b].forEach(function (s) {
      Object.keys(s.checks).forEach(function (k) { if (s.checks[k]) out.checks[k] = true; });
      Object.keys(s.done).forEach(function (k) { if (s.done[k]) out.done[k] = true; });
    });
    var keys = {};
    Object.keys(a.answers).concat(Object.keys(b.answers)).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (k) {
      var x = (a.answers[k] || '').trim(), y = (b.answers[k] || '').trim();
      if (x && y && x !== y) out.answers[k] = x + '\n\n— outra versão —\n' + y;
      else if (x || y) out.answers[k] = x || y;
    });
    var mods = {};
    Object.keys(a.custom).concat(Object.keys(b.custom)).forEach(function (k) { mods[k] = 1; });
    Object.keys(mods).forEach(function (k) {
      var seen = {}, list = [];
      (a.custom[k] || []).concat(b.custom[k] || []).forEach(function (c) {
        var key = (c.q || '').trim().toLowerCase();
        if (!key) return;
        if (seen[key] !== undefined) {
          var cur = list[seen[key]];
          if (!(cur.a || '').trim() && (c.a || '').trim()) cur.a = c.a;
          else if ((c.a || '').trim() && (cur.a || '').trim() !== (c.a || '').trim()) cur.a = cur.a + '\n\n— outra versão —\n' + c.a;
        } else { seen[key] = list.length; list.push({ q: c.q, a: c.a || '' }); }
      });
      if (list.length) out.custom[k] = list;
    });
    return out;
  }

  var pure = { normalize: normalize, isEmpty: isEmpty, decide: decide, merge: merge };
  if (typeof module !== 'undefined' && module.exports) { module.exports = pure; return; }

  /* ---------- parte do navegador ---------- */
  var cfg = root.ROADMAP_CONFIG || {};
  var META_KEY = 'roadmap:sync:v1';
  var enabled = !!(cfg.url && cfg.anonKey && root.supabase && root.supabase.createClient);
  var client = null, user = null, hooks = {}, timer = null, busy = false;
  var meta = { synced: null, dirty: false };
  try { meta = Object.assign(meta, JSON.parse(localStorage.getItem(META_KEY) || '{}')); } catch (e) {}

  function saveMeta() { try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch (e) {} }
  function status(s, extra) { if (hooks.onStatus) hooks.onStatus(s, extra || {}); }
  function errText(e) { return (e && (e.message || e.error_description)) || 'erro desconhecido'; }

  function fetchRemote() {
    return client.from('roadmap_progress').select('data, updated_at').maybeSingle()
      .then(function (r) { if (r.error) throw r.error; return r.data; });
  }
  function adopt(remote) {
    hooks.setState(normalize(remote.data));
    meta = { synced: remote.updated_at, dirty: false };
    saveMeta(); status('ok');
  }

  function push() {
    var data = normalize(hooks.getState());
    var q;
    if (meta.synced) {
      // só atualiza se a nuvem ainda for a versão que este computador viu (evita sobrescrever outro computador)
      q = client.from('roadmap_progress').update({ data: data }).eq('user_id', user.id).eq('updated_at', meta.synced).select('updated_at');
    } else {
      q = client.from('roadmap_progress').insert({ user_id: user.id, data: data }).select('updated_at');
    }
    return q.then(function (r) {
      if (r.error) {
        if (r.error.code === '23505') return reconcile(); // já existe uma linha: compara primeiro
        throw r.error;
      }
      if (!r.data || !r.data.length) return reconcile(); // a nuvem mudou enquanto isso
      meta = { synced: r.data[0].updated_at, dirty: false };
      saveMeta(); status('ok');
    });
  }

  function forcePush(remote) {
    var data = normalize(hooks.getState());
    return client.from('roadmap_progress').upsert({ user_id: user.id, data: data }).select('updated_at').then(function (r) {
      if (r.error) throw r.error;
      meta = { synced: r.data[0].updated_at, dirty: false };
      saveMeta(); status('ok');
    });
  }

  function reconcile() {
    if (!enabled || !user) return Promise.resolve();
    status('saving');
    return fetchRemote().then(function (remote) {
      var local = hooks.getState();
      var action = decide(meta, remote, local);
      if (action === 'pull') return adopt(remote);
      if (action === 'push') return push();
      if (action === 'conflict') {
        status('conflict');
        return new Promise(function (resolve) {
          hooks.askConflict(function (choice) {
            var p;
            if (choice === 'cloud') { adopt(remote); p = Promise.resolve(); }
            else if (choice === 'merge') { hooks.setState(merge(local, remote.data)); meta = { synced: remote.updated_at, dirty: true }; saveMeta(); p = push(); }
            else { meta = { synced: remote.updated_at, dirty: true }; saveMeta(); p = forcePush(remote); }
            resolve(p);
          });
        });
      }
      status('ok');
    }).catch(function (e) { status('error', { message: errText(e) }); });
  }

  function touch() {
    meta.dirty = true; saveMeta();
    if (!enabled || !user) return;
    status('saving');
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (busy) { touch(); return; }
      busy = true;
      push().catch(function (e) { status('error', { message: errText(e) }); }).then(function () { busy = false; });
    }, 1200);
  }

  function init(h) {
    hooks = h;
    if (!enabled) { status('off'); return; }
    client = root.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    client.auth.onAuthStateChange(function (ev, session) {
      var had = !!user;
      user = session && session.user ? session.user : null;
      if (user && !had) { status('ok', { email: user.email }); setTimeout(reconcile, 0); }
      if (!user && had) { meta = { synced: null, dirty: meta.dirty }; saveMeta(); status('out'); }
    });
    client.auth.getSession().then(function (r) {
      if (!r.data.session) status('out');
    });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') reconcile(); });
    root.addEventListener('online', reconcile);
  }

  root.Sync = {
    enabled: enabled,
    init: init,
    touch: touch,
    syncNow: reconcile,
    user: function () { return user; },
    signIn: function (email, password) { return client.auth.signInWithPassword({ email: email, password: password }); },
    signUp: function (email, password) {
      return client.auth.signUp({ email: email, password: password, options: { emailRedirectTo: root.location.origin + root.location.pathname } });
    },
    signOut: function () { return client.auth.signOut(); },
    normalize: normalize,
  };
})(typeof window !== 'undefined' ? window : globalThis);
