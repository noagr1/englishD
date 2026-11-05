'use strict';

const TEST_DATE = new Date(2026, 10, 9); // 9.11.2026

const App = {
  sid: 0,
  parts: JSON.parse(localStorage.getItem('eng4-parts') || 'null') || [1, 2, 3, 4, 5],
  root: null,

  init() {
    this.root = document.getElementById('app');
    Speech.init();
    document.getElementById('homeBtn').onclick = () => this.go('');
    const mute = document.getElementById('muteBtn');
    const paintMute = () => { mute.textContent = Sound.muted ? '🔇' : '🔔'; };
    paintMute();
    mute.onclick = () => { Sound.toggle(); paintMute(); };
    window.addEventListener('hashchange', () => this.route());
    this.refreshStars();
    this.route();
  },

  go(hash) {
    if (location.hash.replace('#', '') === hash) this.route();
    else location.hash = hash;
  },

  route() {
    this.sid++;
    if (Speech.ok) speechSynthesis.cancel();
    const m = location.hash.match(/^#\/game\/(.+)$/);
    const game = m && GAMES.find(g => g.id === m[1]);
    window.scrollTo(0, 0);
    if (game) {
      document.getElementById('title').textContent = `${game.icon} ${game.title}`;
      document.getElementById('homeBtn').hidden = false;
      U.render(this.root, '');
      game.run(this.root);
    } else {
      document.getElementById('title').textContent = 'מתכוננים למבחן באנגלית';
      document.getElementById('homeBtn').hidden = true;
      this.home();
    }
  },

  refreshStars() {
    document.getElementById('stars').textContent = `⭐ ${Progress.total()}`;
  },

  home() {
    const days = Math.ceil((TEST_DATE - new Date().setHours(0, 0, 0, 0)) / 86400000);
    const countdown = days > 1 ? `עוד ${days} ימים למבחן` : days === 1 ? 'המבחן מחר! בהצלחה' : days === 0 ? 'המבחן היום! בהצלחה 🍀' : 'בהצלחה!';
    const maxStars = GAMES.filter(g => !g.noStars).length * 3;
    U.render(this.root, `
      <section class="hero card">
        <div class="hero-emoji">🦉📚✏️</div>
        <h1>English · כיתה ד׳</h1>
        <p>מבחן ב-9.11 · ספר ירוק פרק 1 · ספר צהוב עמ׳ 4-13</p>
        <p class="countdown">${countdown}</p>
        <div class="progress big-progress"><div class="bar" style="width:${(Progress.total() / maxStars) * 100}%"></div></div>
        <p class="hint">אספתם ${Progress.total()} מתוך ${maxStars} כוכבים</p>
        ${Speech.ok ? '' : '<p class="warn">הדפדפן הזה לא תומך בהשמעת מילים. מומלץ Chrome או Safari.</p>'}
      </section>

      <section class="card parts">
        <h3>אילו מילים לתרגל?</h3>
        <div class="chips">${Object.entries(PARTS).map(([k, label]) =>
          `<button class="chip toggle ${this.parts.includes(+k) ? 'on' : ''}" data-part="${k}">${label}</button>`).join('')}
        </div>
      </section>

      ${CATS.map(c => `
        <section class="cat">
          <h2>${c.title}</h2>
          ${c.note ? `<p class="hint">${c.note}</p>` : ''}
          <div class="grid">
            ${GAMES.filter(g => g.cat === c.id).map(g => `
              <a class="game card" href="#/game/${g.id}">
                <span class="game-icon">${g.icon}</span>
                <span class="game-title" dir="auto">${U.esc(g.title)}</span>
                <span class="game-desc" dir="auto">${U.esc(g.desc)}</span>
                ${g.noStars ? '' : `<span class="game-stars">${'⭐'.repeat(Progress.get(g.id))}<span class="dim">${'⭐'.repeat(3 - Progress.get(g.id))}</span></span>`}
              </a>`).join('')}
          </div>
        </section>`).join('')}

      <footer class="center">
        <button class="btn small" id="resetBtn">🗑️ איפוס כוכבים</button>
        <p class="hint">בהצלחה במבחן! 💪</p>
      </footer>`);

    this.root.querySelectorAll('[data-part]').forEach(b => b.onclick = () => {
      const k = +b.dataset.part;
      const next = this.parts.includes(k) ? this.parts.filter(x => x !== k) : [...this.parts, k];
      if (!next.length) return;
      this.parts = next;
      localStorage.setItem('eng4-parts', JSON.stringify(next));
      b.classList.toggle('on');
    });
    document.getElementById('resetBtn').onclick = () => {
      if (confirm('לאפס את כל הכוכבים?')) { Progress.reset(); this.refreshStars(); this.home(); }
    };
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
