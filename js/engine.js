'use strict';
/* מנועי משחק כלליים: חידון, התאמה, זיכרון, איות, בניית משפט, מיון, סידור, בלונים */

const U = {
  shuffle(a) {
    a = [...a];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  pick(a, n) { return U.shuffle(a).slice(0, n); },
  sample(a) { return a[Math.floor(Math.random() * a.length)]; },
  esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },
  /* תשובה נכונה + מסיחים ייחודיים, מעורבבים */
  options(correct, pool, n = 4) {
    const others = U.shuffle([...new Set(pool.filter(x => x !== correct))]).slice(0, n - 1);
    return U.shuffle([correct, ...others]);
  },
  chunk(a, size) {
    const out = [];
    for (let i = 0; i < a.length; i += size) out.push(a.slice(i, i + size));
    if (out.length > 1 && out[out.length - 1].length < 3) {
      const last = out.pop();
      out[out.length - 1].push(...last);
    }
    return out;
  },
  sameSet(a, b) { return a.length === b.length && a.every(x => b.includes(x)); },
  /* כל התוכן מגיע מ-data.js בלבד (אין קלט משתמש), וערכים עוברים U.esc */
  render(el, html) { el.innerHTML = html; },
};

const Speech = {
  ok: 'speechSynthesis' in window,
  voice: null,
  init() {
    if (!this.ok) return;
    const choose = () => {
      const vs = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
      this.voice =
        vs.find(v => /en[-_]US/i.test(v.lang) && /Samantha|Google|Natural|Aria|Jenny/i.test(v.name)) ||
        vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
    };
    choose();
    speechSynthesis.onvoiceschanged = choose;
  },
  say(text, rate = 0.8) {
    if (!this.ok || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    if (this.voice) u.voice = this.voice;
    speechSynthesis.speak(u);
  },
};

const Sound = {
  muted: localStorage.getItem('eng4-muted') === '1',
  ctx: null,
  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('eng4-muted', this.muted ? '1' : '0');
  },
  tone(freqs, dur = 0.12, type = 'sine') {
    if (this.muted) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const ctx = this.ctx;
      let t = ctx.currentTime;
      for (const f of freqs) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type;
        o.frequency.value = f;
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(g).connect(ctx.destination);
        o.start(t);
        o.stop(t + dur);
        t += dur * 0.9;
      }
    } catch (e) { /* אין תמיכה בשמע */ }
  },
  good() { this.tone([660, 880]); },
  bad() { this.tone([240, 180], 0.18, 'triangle'); },
  win() { this.tone([523, 659, 784, 1047], 0.16); },
};

const Progress = {
  key: 'eng4-progress',
  all() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { return {}; }
  },
  get(id) { return this.all()[id] || 0; },
  set(id, stars) {
    const a = this.all();
    if (stars > (a[id] || 0)) {
      a[id] = stars;
      localStorage.setItem(this.key, JSON.stringify(a));
    }
  },
  total() { return Object.values(this.all()).reduce((s, x) => s + x, 0); },
  reset() { localStorage.removeItem(this.key); },
};

function starsFor(pct) { return pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0; }

function confetti() {
  const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff924c'];
  const box = document.createElement('div');
  box.className = 'confetti';
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = U.sample(colors);
    p.style.animationDelay = Math.random() * 0.6 + 's';
    p.style.animationDuration = 1.8 + Math.random() * 1.4 + 's';
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3500);
}

const RESULT_MSG = [
  'לא נורא, ננסה שוב! 🌱',
  'יפה! עוד קצת תרגול 💪',
  'כל הכבוד! 👏',
  'מדהים! אלופים! 🏆',
];

function showResult(root, { gameId, correct, total, stars, line, onAgain }) {
  if (stars === undefined) stars = starsFor(total ? correct / total : 0);
  if (gameId) Progress.set(gameId, stars);
  App.refreshStars();
  if (stars >= 2) { Sound.win(); confetti(); }
  root.innerHTML = `
    <div class="card result pop-in">
      <div class="result-stars">${'⭐'.repeat(stars)}<span class="dim">${'⭐'.repeat(3 - stars)}</span></div>
      <h2>${RESULT_MSG[stars]}</h2>
      <p class="big">${line || `${correct} / ${total}`}</p>
      <div class="row center">
        <button class="btn primary" data-act="again">🔁 עוד פעם</button>
        <button class="btn" data-act="home">🏠 לתפריט</button>
      </div>
    </div>`;
  root.querySelector('[data-act=again]').onclick = onAgain;
  root.querySelector('[data-act=home]').onclick = () => App.go('');
}

function speakBtn(text, label = '🔊') {
  return Speech.ok ? `<button class="btn speak" data-say="${U.esc(text)}" title="הקשבה">${label}</button>` : '';
}

/* כל כפתור עם data-say משמיע את הטקסט */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-say]');
  if (b) { e.stopPropagation(); Speech.say(b.dataset.say); }
}, true);

/* ---------- חידון רב-ברירה ----------
   שאלה: { prompt(html), say?, autoSay?, options[], answer (string | string[]),
           optDir?, promptDir?, optClass?, hint?, speakAnswer? } */
function runQuiz(root, cfg) {
  const sid = App.sid;
  const timed = !!cfg.timeLimit;
  const qs = cfg.questions || [];
  const total = timed ? null : qs.length;
  let i = 0, correct = 0, timeLeft = cfg.timeLimit || 0, timer = null, done = false;

  root.innerHTML = `${cfg.header || ''}
    <div class="quiz">
      <div class="quiz-top"><div class="progress"><div class="bar"></div></div><div class="qcount"></div></div>
      <div class="qbox card"></div>
    </div>`;
  const bar = root.querySelector('.bar'), qcount = root.querySelector('.qcount'), qbox = root.querySelector('.qbox');

  function top() {
    if (timed) {
      bar.style.width = (timeLeft / cfg.timeLimit) * 100 + '%';
      qcount.textContent = `⏱️ ${timeLeft}   ✅ ${correct}`;
    } else {
      bar.style.width = (i / total) * 100 + '%';
      qcount.textContent = `${Math.min(i + 1, total)} / ${total}   ✅ ${correct}`;
    }
  }

  if (timed) {
    timer = setInterval(() => {
      if (sid !== App.sid) return clearInterval(timer);
      timeLeft--;
      top();
      if (timeLeft <= 0) finish();
    }, 1000);
  }

  function finish() {
    if (done) return;
    done = true;
    clearInterval(timer);
    if (sid !== App.sid) return;
    if (timed) {
      const target = cfg.target || 15;
      showResult(root, {
        gameId: cfg.gameId, stars: starsFor(Math.min(correct, target) / target),
        line: `ענית נכון על ${correct} שאלות ב-${cfg.timeLimit} שניות!`, onAgain: cfg.onAgain,
      });
    } else {
      showResult(root, { gameId: cfg.gameId, correct, total, onAgain: cfg.onAgain });
    }
  }

  function next() {
    if (sid !== App.sid || done) return;
    i++;
    if (!timed && i >= total) finish(); else render();
  }

  function render() {
    const q = timed ? cfg.next() : qs[i];
    const multi = Array.isArray(q.answer);
    let locked = false;
    top();
    qbox.innerHTML = `
      <div class="prompt ${q.promptClass || ''}" dir="${q.promptDir || 'auto'}">${q.prompt}</div>
      ${q.say ? speakBtn(q.say, '🔊 הקשבה') : ''}
      ${q.hint ? `<div class="hint">${q.hint}</div>` : ''}
      ${multi ? `<div class="hint">בחרו ${q.answer.length} תשובות ואז לחצו "בדיקה"</div>` : ''}
      <div class="options ${q.optClass || ''}">
        ${q.options.map((o, k) => `<button class="opt" data-k="${k}" dir="${q.optDir || 'auto'}">${U.esc(o)}</button>`).join('')}
      </div>
      ${multi ? '<button class="btn primary check">בדיקה ✔️</button>' : ''}
      <div class="feedback"></div>`;
    qbox.classList.remove('pop-in'); void qbox.offsetWidth; qbox.classList.add('pop-in');
    if (q.say && q.autoSay) setTimeout(() => sid === App.sid && Speech.say(q.say), 250);

    const btns = [...qbox.querySelectorAll('.opt')];
    const fb = qbox.querySelector('.feedback');

    function judge(ok) {
      locked = true;
      btns.forEach(b => {
        const v = q.options[b.dataset.k];
        const isAns = multi ? q.answer.includes(v) : v === q.answer;
        if (isAns) b.classList.add('right');
        b.disabled = true;
      });
      if (ok) {
        correct++;
        Sound.good();
        fb.innerHTML = `<span class="ok">${U.sample(['מעולה! 🎉', 'נכון! ⭐', 'כל הכבוד! 👏', 'יופי! 😃'])}</span>`;
      } else {
        Sound.bad();
        fb.innerHTML = `<span class="no">אוי! התשובה הנכונה מסומנת בירוק</span>${q.explain ? `<div class="explain">${q.explain}</div>` : ''}`;
      }
      if (q.speakAnswer) Speech.say(q.speakAnswer);
      top();
      setTimeout(next, ok ? (timed ? 450 : 900) : (timed ? 1000 : 2000));
    }

    btns.forEach(b => b.onclick = () => {
      if (locked) return;
      const v = q.options[b.dataset.k];
      if (multi) { b.classList.toggle('sel'); return; }
      if (v !== q.answer) b.classList.add('wrong');
      judge(v === q.answer);
    });
    if (multi) {
      qbox.querySelector('.check').onclick = () => {
        if (locked) return;
        const chosen = btns.filter(b => b.classList.contains('sel')).map(b => q.options[b.dataset.k]);
        if (!chosen.length) return;
        btns.forEach(b => {
          if (b.classList.contains('sel') && !q.answer.includes(q.options[b.dataset.k])) b.classList.add('wrong');
        });
        judge(U.sameSet(chosen, q.answer));
      };
    }
  }

  render();
}

/* ---------- התאמה: זוגות {a, b, sayA?, sayB?} ---------- */
function runMatch(root, cfg) {
  const sid = App.sid;
  const rounds = U.chunk(U.shuffle(cfg.pairs), cfg.perRound || 5);
  const n = cfg.pairs.length;
  let r = 0, mistakes = 0;

  function renderRound() {
    const ps = rounds[r];
    let sel = null, left = ps.length;
    const tile = (side, p, k) =>
      `<button class="tile ${cfg[side + 'Class'] || ''}" data-side="${side}" data-k="${k}" dir="${cfg[side + 'Dir'] || 'auto'}">${U.esc(p[side])}</button>`;
    const idx = ps.map((p, k) => ({ p, k }));
    root.innerHTML = `
      ${cfg.header || ''}
      <div class="match-top">סבב ${r + 1} / ${rounds.length} · טעויות: <b class="mis">${mistakes}</b></div>
      <p class="hint center">לחצו על פריט בצד אחד ואז על ההתאמה שלו בצד השני</p>
      <div class="match pop-in">
        <div class="col">${U.shuffle(idx).map(({ p, k }) => tile('a', p, k)).join('')}</div>
        <div class="col">${U.shuffle(idx).map(({ p, k }) => tile('b', p, k)).join('')}</div>
      </div>`;
    const mis = root.querySelector('.mis');
    root.querySelectorAll('.tile').forEach(t => t.onclick = () => {
      if (t.classList.contains('done')) return;
      const p = ps[t.dataset.k];
      const say = t.dataset.side === 'a' ? p.sayA : p.sayB;
      if (say) Speech.say(say);
      if (!sel || sel.dataset.side === t.dataset.side) {
        if (sel) sel.classList.remove('sel');
        sel = t;
        t.classList.add('sel');
        return;
      }
      if (sel.dataset.k === t.dataset.k) {
        [sel, t].forEach(x => { x.classList.remove('sel'); x.classList.add('done'); });
        Sound.good();
        left--;
        if (left === 0) {
          setTimeout(() => {
            if (sid !== App.sid) return;
            r++;
            if (r < rounds.length) renderRound();
            else showResult(root, { gameId: cfg.gameId, correct: Math.max(0, n - mistakes), total: n, onAgain: cfg.onAgain });
          }, 700);
        }
      } else {
        mistakes++;
        mis.textContent = mistakes;
        Sound.bad();
        const a = sel, b = t;
        [a, b].forEach(x => { x.classList.remove('sel'); x.classList.add('wrong'); });
        setTimeout(() => [a, b].forEach(x => x.classList.remove('wrong')), 600);
      }
      sel = null;
    });
  }
  renderRound();
}

/* ---------- זיכרון: זוגות {a, b, say} ---------- */
function runMemory(root, cfg) {
  const sid = App.sid;
  const pairs = cfg.pairs;
  const cards = U.shuffle(pairs.flatMap((p, k) => [{ k, face: p.a, say: p.say }, { k, face: p.b, say: p.say }]));
  let open = [], moves = 0, found = 0, busy = false;
  root.innerHTML = `
    ${cfg.header || ''}
    <div class="match-top">ניסיונות: <b class="moves">0</b> · זוגות: <b class="found">0</b> / ${pairs.length}</div>
    <div class="memory">${cards.map((c, i) => `
      <button class="mcard" data-i="${i}"><span class="back">❓</span><span class="front" dir="auto">${U.esc(c.face)}</span></button>`).join('')}
    </div>`;
  const movesEl = root.querySelector('.moves'), foundEl = root.querySelector('.found');
  root.querySelectorAll('.mcard').forEach(el => el.onclick = () => {
    const c = cards[el.dataset.i];
    if (busy || el.classList.contains('flip')) return;
    el.classList.add('flip');
    if (c.say && /[a-z]/i.test(c.face)) Speech.say(c.say);
    open.push({ el, c });
    if (open.length < 2) return;
    moves++;
    movesEl.textContent = moves;
    const [x, y] = open;
    open = [];
    if (x.c.k === y.c.k) {
      found++;
      foundEl.textContent = found;
      Sound.good();
      x.el.classList.add('done'); y.el.classList.add('done');
      if (found === pairs.length) {
        setTimeout(() => {
          if (sid !== App.sid) return;
          const n = pairs.length;
          const stars = moves <= n * 1.5 ? 3 : moves <= n * 2.2 ? 2 : moves <= n * 3 ? 1 : 0;
          showResult(root, { gameId: cfg.gameId, stars, line: `מצאתם ${n} זוגות ב-${moves} ניסיונות`, onAgain: cfg.onAgain });
        }, 800);
      }
    } else {
      busy = true;
      setTimeout(() => { x.el.classList.remove('flip'); y.el.classList.remove('flip'); busy = false; }, 1000);
    }
  });
}

/* ---------- איות: מילים {en, he, pic} ---------- */
function runSpelling(root, cfg) {
  const sid = App.sid;
  const words = cfg.words;
  let i = 0, firstTry = 0;

  function render() {
    const w = words[i];
    const letters = w.en.split('');
    let tiles = U.shuffle(letters.map((ch, k) => ({ ch, k })));
    if (letters.length > 2) while (tiles.map(t => t.ch).join('') === w.en) tiles = U.shuffle(tiles);
    let filled = [], tries = 0;
    root.innerHTML = `
      ${cfg.header || ''}
      <div class="quiz-top"><div class="progress"><div class="bar" style="width:${(i / words.length) * 100}%"></div></div><div class="qcount">${i + 1} / ${words.length}</div></div>
      <div class="card center pop-in">
        <div class="prompt">${w.pic ? `<div class="emoji-xl">${w.pic}</div>` : ''}<div>${U.esc(w.he)}</div></div>
        ${speakBtn(w.en, '🔊 הקשבה')}
        <div class="slots" dir="ltr">${letters.map((_, k) => `<span class="slot" data-s="${k}"></span>`).join('')}</div>
        <div class="letters" dir="ltr">${tiles.map((t, k) => `<button class="letter" data-t="${k}">${U.esc(t.ch)}</button>`).join('')}</div>
        <div class="row center">
          <button class="btn small" data-act="hint">💡 רמז</button>
          <button class="btn small" data-act="clear">🧹 נקה</button>
          <button class="btn small" data-act="skip">⏭️ דלג</button>
        </div>
        <div class="feedback"></div>
      </div>`;
    const slots = [...root.querySelectorAll('.slot')], tileEls = [...root.querySelectorAll('.letter')];
    const fb = root.querySelector('.feedback');

    function paint() {
      slots.forEach((s, k) => {
        s.textContent = filled[k] !== undefined ? tiles[filled[k]].ch : '';
        s.classList.toggle('full', filled[k] !== undefined);
      });
      tileEls.forEach((t, k) => t.disabled = filled.includes(k));
    }
    function check() {
      if (filled.length < letters.length || filled.includes(undefined)) return;
      const word = filled.map(k => tiles[k].ch).join('');
      if (word === w.en) {
        if (tries === 0) firstTry++;
        Sound.good();
        Speech.say(w.en);
        slots.forEach(s => s.classList.add('right'));
        fb.innerHTML = '<span class="ok">נכון! 🎉</span>';
        setTimeout(() => { if (sid === App.sid) { i++; i < words.length ? render() : end(); } }, 1100);
      } else {
        tries++;
        Sound.bad();
        slots.forEach(s => s.classList.add('wrong'));
        fb.innerHTML = '<span class="no">כמעט! נסו שוב</span>';
        setTimeout(() => { slots.forEach(s => s.classList.remove('wrong')); filled = []; paint(); }, 800);
      }
    }
    tileEls.forEach((t, k) => t.onclick = () => {
      const pos = filled.findIndex(x => x === undefined);
      if (pos >= 0) filled[pos] = k; else filled.push(k);
      paint();
      check();
    });
    slots.forEach((s, k) => s.onclick = () => {
      if (filled[k] === undefined) return;
      filled[k] = undefined;
      while (filled.length && filled[filled.length - 1] === undefined) filled.pop();
      paint();
    });
    root.querySelector('[data-act=clear]').onclick = () => { filled = []; paint(); };
    root.querySelector('[data-act=skip]').onclick = () => {
      fb.innerHTML = `<span class="no" dir="ltr">${U.esc(w.en)}</span>`;
      Speech.say(w.en);
      setTimeout(() => { if (sid === App.sid) { i++; i < words.length ? render() : end(); } }, 1400);
    };
    root.querySelector('[data-act=hint]').onclick = () => {
      tries++;
      // ממלא את האות הנכונה הבאה
      let pos = 0;
      while (pos < filled.length && filled[pos] !== undefined && tiles[filled[pos]].ch === letters[pos]) pos++;
      filled = filled.slice(0, pos);
      if (pos >= letters.length) return;
      const k = tiles.findIndex((t, kk) => t.ch === letters[pos] && !filled.includes(kk));
      filled.push(k);
      paint();
      check();
    };
  }
  function end() { showResult(root, { gameId: cfg.gameId, correct: firstTry, total: words.length, onAgain: cfg.onAgain }); }
  render();
}

/* ---------- בניית משפט: {en, he} ---------- */
function runBuilder(root, cfg) {
  const sid = App.sid;
  const items = cfg.items;
  let i = 0, firstTry = 0;

  function render() {
    const it = items[i];
    const words = it.en.split(' ');
    let tiles = U.shuffle(words.map((w, k) => ({ w, k })));
    while (words.length > 1 && tiles.map(t => t.w).join(' ') === it.en) tiles = U.shuffle(tiles);
    let placed = [], tries = 0;
    root.innerHTML = `
      ${cfg.header || ''}
      <div class="quiz-top"><div class="progress"><div class="bar" style="width:${(i / items.length) * 100}%"></div></div><div class="qcount">${i + 1} / ${items.length}</div></div>
      <div class="card center pop-in">
        <div class="prompt">${U.esc(it.he)}</div>
        <p class="hint">סדרו את המילים למשפט נכון באנגלית</p>
        <div class="answer-line" dir="ltr"></div>
        <div class="words" dir="ltr">${tiles.map((t, k) => `<button class="word" data-t="${k}">${U.esc(t.w)}</button>`).join('')}</div>
        <div class="row center"><button class="btn small" data-act="clear">🧹 נקה</button><button class="btn small" data-act="skip">⏭️ דלג</button></div>
        <div class="feedback"></div>
      </div>`;
    const line = root.querySelector('.answer-line'), tileEls = [...root.querySelectorAll('.word')], fb = root.querySelector('.feedback');

    function paint() {
      line.innerHTML = placed.map((k, pos) => `<button class="word placed" data-p="${pos}">${U.esc(tiles[k].w)}</button>`).join('');
      line.querySelectorAll('.placed').forEach(b => b.onclick = () => { placed.splice(+b.dataset.p, 1); paint(); });
      tileEls.forEach((t, k) => t.classList.toggle('used', placed.includes(k)));
    }
    function advance(delay) {
      setTimeout(() => { if (sid === App.sid) { i++; i < items.length ? render() : end(); } }, delay);
    }
    tileEls.forEach((t, k) => t.onclick = () => {
      if (placed.includes(k)) return;
      placed.push(k);
      paint();
      if (placed.length === words.length) {
        const s = placed.map(x => tiles[x].w).join(' ');
        if (s === it.en) {
          if (tries === 0) firstTry++;
          Sound.good();
          Speech.say(it.en);
          line.classList.add('right');
          fb.innerHTML = '<span class="ok">מצוין! 🎉</span>';
          advance(1500);
        } else {
          tries++;
          Sound.bad();
          line.classList.add('wrong');
          fb.innerHTML = '<span class="no">לא בדיוק… לחצו על מילה כדי להחזיר אותה</span>';
          setTimeout(() => line.classList.remove('wrong'), 700);
        }
      }
    });
    root.querySelector('[data-act=clear]').onclick = () => { placed = []; paint(); fb.innerHTML = ''; };
    root.querySelector('[data-act=skip]').onclick = () => {
      fb.innerHTML = `<span class="no" dir="ltr">${U.esc(it.en)}</span>`;
      Speech.say(it.en);
      advance(2000);
    };
  }
  function end() { showResult(root, { gameId: cfg.gameId, correct: firstTry, total: items.length, onAgain: cfg.onAgain }); }
  render();
}

/* ---------- מיון לקבוצות: buckets [{id,label}], items [{label, valid:[ids], say?}] ---------- */
function runSort(root, cfg) {
  const sid = App.sid;
  const items = U.shuffle(cfg.items);
  const cap = cfg.capacity || Infinity;
  let sel = null, mistakes = 0, placed = 0;
  root.innerHTML = `
    ${cfg.header || ''}
    <div class="match-top">טעויות: <b class="mis">0</b> · נשארו: <b class="left">${items.length}</b></div>
    <p class="hint center">${cfg.hint || 'לחצו על מילה ואז על הקבוצה המתאימה'}</p>
    <div class="buckets">${cfg.buckets.map(b => `
      <div class="bucket" data-b="${U.esc(b.id)}"><div class="bucket-title" dir="auto">${b.label}</div><div class="bucket-items" dir="ltr"></div></div>`).join('')}
    </div>
    <div class="pool" dir="ltr">${items.map((it, k) => `<button class="chip" data-k="${k}">${U.esc(it.label)}</button>`).join('')}</div>`;
  const mis = root.querySelector('.mis'), leftEl = root.querySelector('.left');
  const counts = {};
  root.querySelectorAll('.chip').forEach(c => c.onclick = () => {
    if (sel) sel.classList.remove('sel');
    sel = c;
    c.classList.add('sel');
    const it = items[c.dataset.k];
    if (it.say) Speech.say(it.say);
  });
  root.querySelectorAll('.bucket').forEach(b => b.onclick = () => {
    if (!sel) return;
    const it = items[sel.dataset.k], id = b.dataset.b;
    if (it.valid.includes(id) && (counts[id] || 0) < cap) {
      counts[id] = (counts[id] || 0) + 1;
      Sound.good();
      sel.remove();
      const chip = document.createElement('span');
      chip.className = 'chip in';
      chip.textContent = it.label;
      b.querySelector('.bucket-items').appendChild(chip);
      b.classList.add('flash');
      setTimeout(() => b.classList.remove('flash'), 400);
      sel = null;
      placed++;
      leftEl.textContent = items.length - placed;
      if (placed === items.length) {
        setTimeout(() => {
          if (sid !== App.sid) return;
          if (cfg.onComplete) cfg.onComplete(mistakes);
          else showResult(root, { gameId: cfg.gameId, correct: Math.max(0, items.length - mistakes), total: items.length, onAgain: cfg.onAgain });
        }, 800);
      }
    } else {
      mistakes++;
      mis.textContent = mistakes;
      Sound.bad();
      b.classList.add('shake');
      setTimeout(() => b.classList.remove('shake'), 500);
    }
  });
}

/* ---------- סידור לפי סדר: sets [{items:[...] (בסדר הנכון), title}] ---------- */
function runOrder(root, cfg) {
  const sid = App.sid;
  const sets = cfg.sets;
  let s = 0, mistakes = 0, totalItems = sets.reduce((n, x) => n + x.items.length, 0);

  function render() {
    const set = sets[s];
    let nextIdx = 0;
    let shuffled = U.shuffle(set.items);
    while (set.items.length > 1 && shuffled.join() === set.items.join()) shuffled = U.shuffle(set.items);
    root.innerHTML = `
      ${cfg.header || ''}
      <div class="quiz-top"><div class="progress"><div class="bar" style="width:${(s / sets.length) * 100}%"></div></div><div class="qcount">${s + 1} / ${sets.length} · טעויות: ${mistakes}</div></div>
      <div class="card center pop-in">
        <div class="prompt">${set.title}</div>
        <div class="answer-line" dir="ltr"></div>
        <div class="words" dir="ltr">${shuffled.map(w => `<button class="word" data-w="${U.esc(w)}">${U.esc(w)}</button>`).join('')}</div>
        <div class="feedback"></div>
      </div>`;
    const line = root.querySelector('.answer-line');
    root.querySelectorAll('.words .word').forEach(b => b.onclick = () => {
      if (b.classList.contains('used')) return;
      const w = b.dataset.w;
      if (w === set.items[nextIdx]) {
        nextIdx++;
        b.classList.add('used');
        Sound.good();
        if (cfg.say) Speech.say(w);
        const t = document.createElement('span');
        t.className = 'word placed';
        t.textContent = w;
        line.appendChild(t);
        if (nextIdx === set.items.length) {
          line.classList.add('right');
          root.querySelector('.feedback').innerHTML = '<span class="ok">מעולה! 🎉</span>';
          setTimeout(() => { if (sid === App.sid) { s++; s < sets.length ? render() : end(); } }, 1000);
        }
      } else {
        mistakes++;
        Sound.bad();
        b.classList.add('shake');
        setTimeout(() => b.classList.remove('shake'), 500);
      }
    });
  }
  function end() { showResult(root, { gameId: cfg.gameId, correct: Math.max(0, totalItems - mistakes), total: totalItems, onAgain: cfg.onAgain }); }
  render();
}

/* ---------- בלונים: rounds [{prompt, options, answer, say?}] ---------- */
function runBalloons(root, cfg) {
  const sid = App.sid;
  const rounds = cfg.rounds;
  let r = 0, score = 0;
  const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff924c'];

  function render() {
    const q = rounds[r];
    let over = false, firstTry = true;
    root.innerHTML = `
      ${cfg.header || ''}
      <div class="quiz-top"><div class="progress"><div class="bar" style="width:${(r / rounds.length) * 100}%"></div></div><div class="qcount">${r + 1} / ${rounds.length} · 🎈 ${score}</div></div>
      <div class="sky">
        <div class="sky-prompt">פוצצו את הבלון: <b>${U.esc(q.prompt)}</b></div>
        ${U.shuffle(q.options).map((o, k, arr) => {
          const left = 5 + (k * 90) / arr.length + Math.random() * 4;
          const dur = 7 + Math.random() * 2.5;
          const delay = Math.random() * 0.8;
          return `<button class="balloon" data-v="${U.esc(o)}" style="left:${left}%;--c:${colors[k % colors.length]};animation-duration:${dur}s;animation-delay:${delay}s" dir="ltr">${U.esc(o)}</button>`;
        }).join('')}
      </div>`;
    const balloons = [...root.querySelectorAll('.balloon')];
    const finishRound = (delay) => setTimeout(() => {
      if (sid !== App.sid) return;
      r++;
      r < rounds.length ? render() : showResult(root, { gameId: cfg.gameId, correct: score, total: rounds.length, onAgain: cfg.onAgain });
    }, delay);
    balloons.forEach(b => {
      b.onclick = () => {
        if (over || b.classList.contains('popped')) return;
        if (b.dataset.v === q.answer) {
          over = true;
          if (firstTry) score++;
          b.classList.add('popped');
          Sound.good();
          Speech.say(q.answer);
          finishRound(700);
        } else {
          firstTry = false;
          b.classList.add('popped', 'bad');
          Sound.bad();
        }
      };
      b.addEventListener('animationend', e => {
        if (e.animationName !== 'rise' || over || b.dataset.v !== q.answer) return;
        over = true;
        Sound.bad();
        root.querySelector('.sky-prompt').innerHTML = `הבלון ברח! התשובה: <b dir="ltr">${U.esc(q.answer)}</b>`;
        finishRound(1500);
      });
    });
  }
  render();
}
