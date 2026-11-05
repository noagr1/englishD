'use strict';
/* הגדרת כל המשחקים */

const pool = () => {
  const v = VOCAB.filter(w => App.parts.includes(w.part));
  return v.length >= 4 ? v : VOCAB;
};
const picPool = () => {
  const v = pool().filter(w => w.pic);
  return v.length >= 4 ? v : VOCAB.filter(w => w.pic);
};
const en = s => `<span dir="ltr" class="en-big">${U.esc(s)}</span>`;
const enSent = s => `<span dir="ltr" class="en-sent">${U.esc(s)}</span>`;
const YN = [YES, NO];

/* ---------- מחוללי שאלות ---------- */
const Q = {
  picToWord(w, p) {
    return { prompt: `<div class="emoji-xl">${w.pic}</div>מה המילה באנגלית?`, options: U.options(w.en, p.map(x => x.en)), answer: w.en, optDir: 'ltr', speakAnswer: w.en };
  },
  wordToPic(w, p) {
    return { prompt: `${en(w.en)}<div class="hint">בחרו את התמונה המתאימה</div>`, say: w.en, autoSay: true, options: U.options(w.pic, p.map(x => x.pic)), answer: w.pic, optClass: 'emoji-opts' };
  },
  enToHe(w, p) {
    return { prompt: `מה הפירוש של<br>${en(w.en)}`, say: w.en, autoSay: true, options: U.options(w.he, p.map(x => x.he)), answer: w.he, optDir: 'rtl' };
  },
  heToEn(w, p) {
    return { prompt: `איך אומרים באנגלית:<br><b class="he-big">${U.esc(w.he)}</b>`, options: U.options(w.en, p.map(x => x.en)), answer: w.en, optDir: 'ltr', speakAnswer: w.en };
  },
  listen(w, p) {
    return { prompt: '🎧 הקשיבו ובחרו את המילה ששמעתם', say: w.en, autoSay: true, options: U.options(w.en, p.map(x => x.en)), answer: w.en, optDir: 'ltr' };
  },
  missing(w) {
    const start = /[A-Z]/.test(w.en[0]) ? 1 : 0;
    const k = start + Math.floor(Math.random() * (w.en.length - start));
    const letter = w.en[k];
    const masked = w.en.slice(0, k) + '_' + w.en.slice(k + 1);
    const others = 'abcdefghiklmnoprstuwy'.split('').filter(c => c !== letter);
    return {
      prompt: `${w.pic ? `<div class="emoji-xl">${w.pic}</div>` : ''}<div>${U.esc(w.he)}</div>${en(masked.split('').join(' '))}<div class="hint">איזו אות חסרה?</div>`,
      options: U.shuffle([letter, ...U.pick(others, 3)]), answer: letter, optDir: 'ltr', optClass: 'letter-opts', speakAnswer: w.en,
    };
  },
  fill(f) {
    const s = U.esc(f.s).replace('___', '<span class="blank">____</span>');
    return { prompt: `<span dir="ltr" class="en-sent">${s}</span>`, hint: `💡 ${U.esc(f.he)}`, options: U.shuffle(f.o), answer: f.a, optDir: 'ltr', speakAnswer: f.s.replace('___', f.a) };
  },
  verbParts() {
    const verb = U.sample(Object.keys(VERBS));
    const [obj, objHe] = U.sample(VERB_OBJECTS[verb]);
    const form = U.sample(['yes', 'no', 'q']);
    const mk = (v, f) => ({
      en: f === 'yes' ? `I ${v} ${obj}.` : f === 'no' ? `I don't ${v} ${obj}.` : `Do you ${v} ${obj}?`,
      he: `${VERBS[v][f]} ${objHe}${f === 'q' ? '?' : '.'}`,
    });
    const all = Object.keys(VERBS).flatMap(v => ['yes', 'no', 'q'].map(f => mk(v, f)));
    return { right: mk(verb, form), all };
  },
  verbHeToEn() {
    const { right, all } = Q.verbParts();
    return { prompt: `איך אומרים באנגלית:<br><b class="he-big">${U.esc(right.he)}</b>`, options: U.options(right.en, all.map(x => x.en)), answer: right.en, optDir: 'ltr', speakAnswer: right.en };
  },
  verbEnToHe() {
    const { right, all } = Q.verbParts();
    return { prompt: `מה הפירוש?<br>${enSent(right.en)}`, say: right.en, options: U.options(right.he, all.map(x => x.he)), answer: right.he, optDir: 'rtl' };
  },
  qa(item) {
    return { prompt: `${enSent(item.q)}<div class="hint">${U.esc(item.qhe)}</div><div class="hint">מה התשובה המתאימה?</div>`, say: item.q, options: U.options(item.a, QA.map(x => x.a)), answer: item.a, optDir: 'ltr' };
  },
  qaReverse(item) {
    return { prompt: `${enSent(item.a)}<div class="hint">על איזו שאלה זו התשובה?</div>`, say: item.a, options: U.options(item.q, QA.map(x => x.q)), answer: item.q, optDir: 'ltr' };
  },
  soundOf(word, snd) {
    return { prompt: `${en(word)}<div class="hint">איזה צליל יש במילה?</div>`, say: word, autoSay: true, options: ['ch', 'sh', 'th', 'ph'], answer: snd, optDir: 'ltr', optClass: 'letter-opts' };
  },
  wordWithSound(snd) {
    const right = U.sample(SOUNDS[snd]);
    const others = Object.keys(SOUNDS).filter(s => s !== snd).map(s => U.sample(SOUNDS[s]));
    return { prompt: `באיזו מילה יש את הצליל <b dir="ltr" class="en-big">${snd}</b>?`, options: U.shuffle([right, ...others]), answer: right, optDir: 'ltr', speakAnswer: right };
  },
  day() {
    const k = Math.floor(Math.random() * 7), d = DAYS[k];
    const ens = DAYS.map(x => x.en), hes = DAYS.map(x => x.he);
    switch (U.sample(['he', 'en', 'after', 'before'])) {
      case 'he': return { prompt: `איך אומרים באנגלית:<br><b class="he-big">${d.he}</b>`, options: U.options(d.en, ens), answer: d.en, optDir: 'ltr', speakAnswer: d.en };
      case 'en': return { prompt: en(d.en), say: d.en, autoSay: true, options: U.options(d.he, hes), answer: d.he, optDir: 'rtl' };
      case 'after': {
        const a = DAYS[(k + 1) % 7].en;
        return { prompt: `${enSent(`What day comes after ${d.en}?`)}<div class="hint">איזה יום בא אחרי ${d.he}?</div>`, options: U.options(a, ens), answer: a, optDir: 'ltr', speakAnswer: a };
      }
      default: {
        const b = DAYS[(k + 6) % 7].en;
        return { prompt: `${enSent(`What day comes before ${d.en}?`)}<div class="hint">איזה יום בא לפני ${d.he}?</div>`, options: U.options(b, ens), answer: b, optDir: 'ltr', speakAnswer: b };
      }
    }
  },
  story(q) {
    return { prompt: enSent(q.q), say: q.q.replace('___', 'blank'), options: q.o ? U.shuffle(q.o) : YN, answer: q.a, optDir: 'ltr' };
  },
};

/* עוטף משחק כך ש"עוד פעם" מייצר סבב חדש */
const again = start => root => { const go = () => start(root, go); go(); };
const quiz = (id, make, extra = {}) => again((root, go) => runQuiz(root, { gameId: id, questions: make(), onAgain: go, ...extra }));
const alt = (list, fns, p) => list.map((w, k) => fns[k % fns.length](w, p));

/* ---------- כרטיסיות ---------- */
function flashcards(root) {
  const list = U.shuffle(pool());
  let i = 0, flipped = false;
  function render() {
    const w = list[i];
    root.innerHTML = `
      <div class="flash-wrap">
        <div class="qcount center">${i + 1} / ${list.length}</div>
        <button class="flash ${flipped ? 'flip' : ''}">
          <div class="flash-inner">
            <div class="flash-face front">${w.pic ? `<div class="emoji-xl">${w.pic}</div>` : ''}<div class="en-big" dir="ltr">${U.esc(w.en)}</div></div>
            <div class="flash-face back"><div class="he-big">${U.esc(w.he)}</div><div class="hint">${PARTS[w.part]}</div></div>
          </div>
        </button>
        <div class="row center">
          <button class="btn" data-act="prev">➡️ הקודם</button>
          ${speakBtn(w.en, '🔊')}
          <button class="btn primary" data-act="next">הבא ⬅️</button>
        </div>
        <p class="hint center">לחצו על הכרטיס כדי לראות את התרגום</p>
      </div>`;
    root.querySelector('.flash').onclick = e => { flipped = !flipped; e.currentTarget.classList.toggle('flip', flipped); };
    root.querySelector('[data-act=prev]').onclick = () => { i = (i - 1 + list.length) % list.length; flipped = false; render(); };
    root.querySelector('[data-act=next]').onclick = () => { i = (i + 1) % list.length; flipped = false; render(); };
    Speech.say(w.en);
  }
  render();
}

/* ---------- קטע קריאה ---------- */
function storyGame(st) {
  return again((root, go) => {
    const full = st.lines.map(l => l[1]).join(' ');
    root.innerHTML = `
      <details class="card story" open>
        <summary>📖 ${U.esc(st.title)} <small>(${st.page})</small></summary>
        <div class="row center">${speakBtn(full, '🔊 הקראת כל הטקסט')}</div>
        <div class="story-lines" dir="ltr">
          ${st.lines.map(([who, t]) => `
            <div class="line">${speakBtn(t)}${who ? `<b class="who">${U.esc(who)}:</b> ` : ''}<span>${U.esc(t)}</span></div>`).join('')}
        </div>
        <div class="center"><button class="btn primary start">קראתי! לשאלות ⬅️</button></div>
      </details>
      <div class="story-q"></div>`;
    root.querySelector('.start').onclick = () => {
      const d = root.querySelector('details');
      d.open = false;
      d.querySelector('summary').insertAdjacentHTML('beforeend', ' <small>– לחצו כדי לראות שוב</small>');
      root.querySelector('.start').remove();
      const qroot = root.querySelector('.story-q');
      runQuiz(qroot, { gameId: 'story-' + st.id, questions: U.shuffle(st.questions).map(Q.story), onAgain: go });
      qroot.scrollIntoView({ behavior: 'smooth' });
    };
  });
}

/* ---------- רשימת המשחקים ---------- */
const CATS = [
  { id: 'vocab', title: '📚 אוצר מילים', note: 'בחרו למעלה אילו חלקים לתרגל' },
  { id: 'sent', title: '✍️ משפטים ושאלות' },
  { id: 'sound', title: '🔊 צלילים: ch · sh · th · ph' },
  { id: 'days', title: '📅 ימי השבוע' },
  { id: 'read', title: '📖 הבנת הנקרא (ספר צהוב עמ׳ 4-13)' },
  { id: 'abc', title: '🔤 סדר ABC' },
  { id: 'final', title: '🏆 אתגרים' },
];

const GAMES = [
  { id: 'flash', cat: 'vocab', icon: '🃏', title: 'כרטיסיות', desc: 'הופכים כרטיס ושומעים', noStars: true, run: flashcards },
  { id: 'pic', cat: 'vocab', icon: '🖼️', title: 'מילה ותמונה', desc: 'התאימו מילה לתמונה',
    run: quiz('pic', () => alt(U.pick(picPool(), 10), [Q.wordToPic, Q.picToWord], picPool())) },
  { id: 'translate', cat: 'vocab', icon: '🔁', title: 'תרגום', desc: 'אנגלית ↔ עברית',
    run: quiz('translate', () => alt(U.pick(pool(), 12), [Q.enToHe, Q.heToEn], pool())) },
  { id: 'listen', cat: 'vocab', icon: '🎧', title: 'הקשבה', desc: 'שומעים ובוחרים מילה',
    run: quiz('listen', () => U.pick(pool(), 10).map(w => Q.listen(w, pool()))) },
  { id: 'matchwords', cat: 'vocab', icon: '🔗', title: 'התאמת מילים', desc: 'מחברים מילה לתרגום',
    run: again((root, go) => runMatch(root, { gameId: 'matchwords', pairs: U.pick(pool(), 15).map(w => ({ a: w.en, b: w.he, sayA: w.en })), aDir: 'ltr', bDir: 'rtl', onAgain: go })) },
  { id: 'memory', cat: 'vocab', icon: '🧠', title: 'משחק זיכרון', desc: 'מוצאים זוגות',
    run: again((root, go) => runMemory(root, { gameId: 'memory', pairs: U.pick(pool(), 6).map(w => ({ a: w.en, b: w.pic || w.he, say: w.en })), onAgain: go })) },
  { id: 'spell', cat: 'vocab', icon: '🔠', title: 'איות', desc: 'בונים את המילה מאותיות',
    run: again((root, go) => runSpelling(root, { gameId: 'spell', words: U.pick(pool().filter(w => !w.en.includes(' ')), 8), onAgain: go })) },
  { id: 'missing', cat: 'vocab', icon: '🕵️', title: 'האות החסרה', desc: 'איזו אות נעלמה?',
    run: quiz('missing', () => U.pick(pool().filter(w => !w.en.includes(' ') && w.en.length > 2), 10).map(Q.missing)) },
  { id: 'balloons', cat: 'vocab', icon: '🎈', title: 'פוצצו בלונים', desc: 'מהר, לפני שהבלון בורח!',
    run: again((root, go) => runBalloons(root, { gameId: 'balloons', rounds: U.pick(pool(), 10).map(w => ({ prompt: w.he, answer: w.en, options: U.options(w.en, pool().map(x => x.en)) })), onAgain: go })) },

  { id: 'fill', cat: 'sent', icon: '🧩', title: 'השלמת משפטים', desc: 'מהסיפורים בספר',
    run: quiz('fill', () => U.pick(FILL, 12).map(Q.fill)) },
  { id: 'sentpic', cat: 'sent', icon: '🖼️', title: 'משפט ותמונה', desc: 'מתאימים משפט לתמונה',
    run: again((root, go) => runMatch(root, { gameId: 'sentpic', pairs: U.pick(SENT_PICS, 12).map(s => ({ a: s.en, b: s.pic, sayA: s.en })), perRound: 4, aDir: 'ltr', aClass: 'sent', bClass: 'emoji-tile', onAgain: go })) },
  { id: 'verbs', cat: 'sent', icon: '💬', title: 'have · like · want · need', desc: 'יש לי / אוהב / רוצה / צריך',
    run: quiz('verbs', () => Array.from({ length: 12 }, (_, k) => k % 2 ? Q.verbEnToHe() : Q.verbHeToEn()),
      { header: `<div class="card tip" dir="ltr"><b>I have</b> יש לי · <b>I don't have</b> אין לי<br><b>I like</b> אני אוהב/ת · <b>I don't like</b> אני לא אוהב/ת<br><b>I want</b> אני רוצה · <b>I don't want</b> אני לא רוצה<br><b>I need</b> אני צריך/ה · <b>I don't need</b> אני לא צריך/ה<br><b>Do you ...?</b> שאלה</div>` }) },
  { id: 'build', cat: 'sent', icon: '🏗️', title: 'בונים משפט', desc: 'מסדרים מילים למשפט',
    run: again((root, go) => runBuilder(root, { gameId: 'build', items: U.pick(BUILD, 8), onAgain: go })) },
  { id: 'qamatch', cat: 'sent', icon: '❓', title: 'שאלה ותשובה', desc: 'מחברים שאלה לתשובה',
    run: again((root, go) => runMatch(root, { gameId: 'qamatch', pairs: U.shuffle(QA).map(x => ({ a: x.q, b: x.a, sayA: x.q, sayB: x.a })), perRound: 4, aDir: 'ltr', bDir: 'ltr', aClass: 'sent', bClass: 'sent', onAgain: go })) },
  { id: 'qaquiz', cat: 'sent', icon: '🙋', title: 'עונים על שאלות', desc: "What's your name? ...",
    run: quiz('qaquiz', () => U.shuffle(QA).map((x, k) => k % 3 === 2 ? Q.qaReverse(x) : Q.qa(x))) },

  { id: 'soundsort', cat: 'sound', icon: '🧺', title: 'מיון צלילים', desc: 'שמים כל מילה בסל שלה',
    run: again((root, go) => runSort(root, {
      gameId: 'soundsort', onAgain: go,
      buckets: [{ id: 'ch', label: 'ch 🪑' }, { id: 'sh', label: 'sh 🐟' }, { id: 'th', label: 'th 👦' }, { id: 'ph', label: 'ph 📱' }],
      items: Object.entries(SOUNDS).flatMap(([s, ws]) => ws.map(w => ({ label: w, valid: [s], say: w }))),
    })) },
  { id: 'soundquiz', cat: 'sound', icon: '👂', title: 'איזה צליל?', desc: 'שומעים ומזהים',
    run: quiz('soundquiz', () => {
      const all = U.shuffle(Object.entries(SOUNDS).flatMap(([s, ws]) => ws.map(w => [w, s]))).slice(0, 8);
      return U.shuffle([...all.map(([w, s]) => Q.soundOf(w, s)), ...U.pick(Object.keys(SOUNDS), 4).map(Q.wordWithSound)]);
    }) },

  { id: 'daysmatch', cat: 'days', icon: '🔗', title: 'התאמת ימים', desc: 'אנגלית ↔ עברית',
    run: again((root, go) => runMatch(root, { gameId: 'daysmatch', pairs: DAYS.map(d => ({ a: d.en, b: d.he, sayA: d.en })), perRound: 7, aDir: 'ltr', onAgain: go })) },
  { id: 'daysorder', cat: 'days', icon: '🔢', title: 'סדר הימים', desc: 'מסדרים מראשון עד שבת',
    run: again((root, go) => {
      const part = () => { const s = Math.floor(Math.random() * 4); return DAYS.slice(s, s + 4).map(d => d.en); };
      runOrder(root, { gameId: 'daysorder', say: true, onAgain: go, sets: [
        { title: 'סדרו את כל ימי השבוע – מיום ראשון ועד שבת', items: DAYS.map(d => d.en) },
        { title: 'סדרו את הימים לפי הסדר', items: part() },
        { title: 'סדרו את הימים לפי הסדר', items: part() },
      ] });
    }) },
  { id: 'daysquiz', cat: 'days', icon: '📆', title: 'חידון ימים', desc: 'מה בא אחרי? איך אומרים?',
    run: quiz('daysquiz', () => Array.from({ length: 10 }, Q.day)) },
  { id: 'chadweek', cat: 'days', icon: '🗓️', title: 'מערכת השעות של צ׳אד', desc: 'ממלאים את הטבלה',
    run: again((root, go) => runSort(root, {
      gameId: 'chadweek', onAgain: go, capacity: 2,
      hint: 'קראו את הטקסט, לחצו על מקצוע ואז על היום שבו לומדים אותו',
      header: `<div class="card tip" dir="ltr">${STORIES.find(s => s.id === 'chad').lines.map(l => U.esc(l[1])).join('<br>')}</div>`,
      buckets: Object.keys(CHAD_WEEK).map(d => ({ id: d, label: `${d}<br><small>${DAYS.find(x => x.en === d).he}</small>` })),
      items: Object.entries(CHAD_WEEK).flatMap(([, subs]) => subs).map(sub => ({
        label: sub, say: sub, valid: Object.keys(CHAD_WEEK).filter(d => CHAD_WEEK[d].includes(sub)),
      })),
    })) },

  ...STORIES.map(st => ({ id: 'story-' + st.id, cat: 'read', icon: st.icon, title: st.title, desc: st.page, run: storyGame(st) })),

  { id: 'abc', cat: 'abc', icon: '🔤', title: 'סדר ABC', desc: 'שמות ומילים לפי האלף-בית',
    run: again((root, go) => runOrder(root, { gameId: 'abc', say: true, onAgain: go,
      sets: U.pick(ABC_SETS, 5).map(set => ({ title: 'לחצו על המילים לפי סדר ה-ABC<div class="hint" dir="ltr">a b c d e f g h i j k l m n o p q r s t u v w x y z</div>',
        items: [...set].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())) })) })) },

  { id: 'mock', cat: 'final', icon: '📝', title: 'מבחן לדוגמה', desc: '20 שאלות מכל החומר',
    run: quiz('mock', () => {
      const p = VOCAB, pp = VOCAB.filter(w => w.pic);
      const storyQs = STORIES.flatMap(s => s.questions.filter(q => !Array.isArray(q.a)).map(q => ({ ...q, title: s.title })));
      return U.shuffle([
        ...U.pick(pp, 3).map(w => Q.picToWord(w, pp)),
        ...alt(U.pick(p, 4), [Q.enToHe, Q.heToEn], p),
        ...U.pick(FILL, 3).map(Q.fill),
        Q.verbHeToEn(), Q.verbEnToHe(),
        ...U.pick(QA, 2).map(Q.qa),
        Q.wordWithSound(U.sample(Object.keys(SOUNDS))), Q.wordWithSound(U.sample(Object.keys(SOUNDS))),
        Q.day(), Q.day(),
        ...U.pick(storyQs, 3).map(q => ({ ...Q.story(q), hint: `📖 מתוך: ${U.esc(q.title)}` })),
      ]);
    }) },
  { id: 'speed', cat: 'final', icon: '⚡', title: 'מרוץ נגד הזמן', desc: 'כמה תספיקו ב-60 שניות?',
    run: again((root, go) => runQuiz(root, {
      gameId: 'speed', timeLimit: 60, target: 15, onAgain: go,
      next: () => { const w = U.sample(pool()); return U.sample([Q.enToHe, Q.heToEn])(w, pool()); },
    })) },
];
