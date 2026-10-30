(() => {
  "use strict";

  const C = window.INVITE_CONFIG || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const rand = (a, b) => a + Math.random() * (b - a);

  const screen = $("#screen");
  const progress = $("#progress-bar");
  const stepLabel = $("#step-label");
  const effectsLayer = $("#effects-layer");

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const state = {
    step: 0,
    date: "",
    time: "",
    food: [],
    activities: [],
    moods: [],
    custom: { food: [], activities: [] },
    comment: "",
    noCount: 0,
    busy: false,
    opened: false,
    motion: C.animation?.enabled !== false && !prefersReduced
  };

  const steps = [
    "начало", "открытка", "приглашение", "ура!",
    "дата и время", "план встречи", "пожелания", "готово"
  ];

  const SCREEN_GIFS = {
    0: "opening", 2: "invitation", 3: "celebration",
    4: "schedule", 5: "plan", 6: "notes", 7: "summary"
  };

  /* ---------- Утилиты ---------- */
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function nowTimeStr() {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function fmtDate(date) {
    if (!date) return "Не выбрана";
    const d = new Date(`${date}T12:00:00`);
    return new Intl.DateTimeFormat("ru-RU", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(d);
  }

  function val(list) {
    return list.length ? list.join(", ") : (C.labels?.empty || "Пока не выбрано");
  }

  /* ---------- Тема и прогресс ---------- */
  function setBaseTheme() {
    const root = document.documentElement.style;
    if (C.theme?.text) root.setProperty("--text", C.theme.text);
    if (C.theme?.muted) root.setProperty("--muted", C.theme.muted);
    if (C.animation?.durationMs) {
      root.setProperty("--duration", `${Math.max(0, Number(C.animation.durationMs))}ms`);
    }
    document.title = C.pageTitle || "Приглашение";
    const footer = $("#footer-note");
    if (footer) footer.textContent = C.footerText || "";
    syncMotionUI();
  }

  function applyPalette() {
    const p = (C.palettes || [])[state.step];
    if (!p) return;
    const root = document.documentElement.style;
    root.setProperty("--bg", p.bg);
    root.setProperty("--primary", p.primary);
    root.setProperty("--primary-dark", p.primaryDark);
    root.setProperty("--blob-a", p.blobA);
    root.setProperty("--blob-b", p.blobB);
    root.setProperty("--blob-c", p.blobC);
    $('meta[name="theme-color"]')?.setAttribute("content", p.bg);
  }

  function syncMotionUI() {
    document.body.classList.toggle("reduce-motion", !state.motion);
    const toggle = $("#motion-toggle");
    if (toggle) toggle.textContent = state.motion ? "✦" : "○";
  }

  function updateProgress() {
    const pct = Math.max(8, ((state.step + 1) / steps.length) * 100);
    if (progress) progress.style.width = `${pct}%`;
    progress?.parentElement?.setAttribute("aria-valuenow", String(Math.round(pct)));
    if (stepLabel) stepLabel.textContent = steps[state.step] || "приглашение";
  }

  /* ---------- Фоновые сердечки ---------- */
  function initBgHearts() {
    const layer = $("#bg-hearts");
    if (!layer) return;
    const glyphs = ["♡", "♥", "✦", "♡"];
    for (let i = 0; i < 9; i++) {
      const el = document.createElement("span");
      el.className = "bg-heart";
      el.textContent = glyphs[i % glyphs.length];
      el.style.left = `${rand(3, 96)}%`;
      el.style.fontSize = `${rand(14, 30)}px`;
      el.style.setProperty("--t", `${rand(16, 28)}s`);
      el.style.setProperty("--d", `${-rand(0, 24)}s`);
      el.style.setProperty("--sway", `${rand(-50, 50)}px`);
      layer.appendChild(el);
    }
  }

  /* ---------- Рендер ---------- */
  function render(html, { center = false } = {}) {
    screen.classList.remove("exiting", "enter");
    screen.innerHTML = html;

    const card = screen.firstElementChild;
    if (card && center) card.classList.add("center");

    $$(".card > *", screen).forEach((el, i) => el.style.setProperty("--i", i));

    void screen.offsetWidth; // перезапуск анимации появления
    screen.classList.add("enter");

    updateProgress();
    applyPalette();
    hydrateGifs();

    window.scrollTo({ top: 0, behavior: state.motion ? "smooth" : "auto" });

    const heading = $("h1, h2", screen);
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function go(step) {
    if (state.busy) return;
    saveFields();
    state.busy = true;
    if (state.motion) screen.classList.add("exiting");

    window.setTimeout(() => {
      state.step = step;
      renderStep();
      window.setTimeout(() => { state.busy = false; }, state.motion ? 350 : 0);
    }, state.motion ? 240 : 0);
  }

  function saveFields() {
    const comment = $("#comment");
    const date = $("#meet-date");
    const time = $("#meet-time");
    if (comment) state.comment = comment.value;
    if (date) state.date = date.value;
    if (time) state.time = time.value;
  }

  /* ---------- Гифки ---------- */
  function heroArt(stepKey, small = false) {
    const name = C.gifs?.[stepKey];
    if (!name) return "";
    const fallback = C.gifFallback?.[stepKey] || "🐱";
    return `
      <div class="hero-art ${small ? "sm" : ""}" data-gif="${esc(name)}" data-fallback="${esc(fallback)}" title="Потрогай меня">
        <div class="gif-skeleton"></div>
        <div class="gif-stage"></div>
      </div>`;
  }

  function hydrateGifs() {
    $$(".hero-art", screen).forEach(box => {
      const name = box.dataset.gif;
      const stage = $(".gif-stage", box);
      const base = C.gifBase ?? "gifs/";
      const sources = Array.from(new Set([base + name, name]));

      const tryNext = i => {
        if (i >= sources.length) {
          stage.innerHTML = `<span class="mascot" aria-hidden="true">${esc(box.dataset.fallback)}</span>`;
          requestAnimationFrame(() => box.classList.add("ready"));
          return;
        }
        const img = new Image();
        img.className = "custom-gif";
        img.alt = "";
        img.decoding = "async";
        img.onload = () => {
          stage.replaceChildren(img);
          requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add("ready")));
        };
        img.onerror = () => tryNext(i + 1);
        img.src = sources[i];
      };
      tryNext(0);
    });
  }

  /* ---------- Кнопки ---------- */
  function button(text, action, cls = "primary-btn", attrs = "") {
    return `<button type="button" class="${cls}" data-action="${action}" ${attrs}>${esc(text)}</button>`;
  }

  function backButton(target) {
    return button(C.labels?.back || "Назад", `go-${target}`, "ghost-btn");
  }

  /* ---------- Экраны ---------- */
  function renderStep() {
    setBaseTheme();
    switch (state.step) {
      case 0: return renderOpening();
      case 1: return renderEnvelope();
      case 2: return renderInvitation();
      case 3: return renderCelebration();
      case 4: return renderSchedule();
      case 5: return renderPlan();
      case 6: return renderNotes();
      case 7: return renderSummary();
      default:
        state.step = 0;
        return renderOpening();
    }
  }

  function renderOpening() {
    const x = C.opening || {};
    render(`
      <div class="card">
        ${heroArt(SCREEN_GIFS[0])}
        <span class="eyebrow">${esc(x.eyebrow || "")}</span>
        <h1>${esc(x.title || "Приглашение для тебя")}</h1>
        <p>${esc(x.description || "")}</p>
        <div class="button-row">${button(x.button || "Начать", "start")}</div>
      </div>
    `, { center: true });
  }

  function renderEnvelope() {
    const x = C.envelope || {};
    state.opened = false;
    render(`
      <div class="card">
        <span class="eyebrow">${esc(x.eyebrow || "")}</span>
        <div class="envelope-wrap" id="envelope" data-action="open-letter" role="button" tabindex="0" aria-label="Открыть письмо">
          <div class="env-back"></div>
          <div class="env-letter"><span>♡</span><i></i><i></i></div>
          <div class="env-front"></div>
          <div class="env-flap"></div>
          <div class="env-seal">${esc(x.seal || "♡")}</div>
        </div>
        <h2>${esc(x.title || "")}</h2>
        <p>${esc(x.description || "")}</p>
        <div class="button-row">${button(x.button || "Открыть", "open-letter")}</div>
      </div>
    `, { center: true });
  }

  function openLetter() {
    if (state.opened || state.busy) return;
    state.opened = true;

    const env = $("#envelope");
    env?.classList.add("open");
    $$('[data-action="open-letter"]', screen).forEach(b => { if (b.tagName === "BUTTON") b.disabled = true; });

    if (env && state.motion) {
      const r = env.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 12);
    }
    window.setTimeout(() => go(2), state.motion ? 1200 : 0);
  }

  function renderInvitation() {
    const x = C.invitation || {};
    state.noCount = 0;
    render(`
      <div class="card">
        ${heroArt(SCREEN_GIFS[2])}
        <span class="eyebrow">${esc(x.eyebrow || "")}</span>
        <h1>${esc(x.title || "")}</h1>
        <p>${esc(x.description || "")}</p>
        <div class="question-actions" id="question-actions">
          ${button(x.yes || "Да!", "yes")}
          <button type="button" class="no-btn" id="no-button" data-action="no">${esc(x.no || "Нет")}</button>
        </div>
        <p class="notice" id="no-reaction" aria-live="polite"></p>
      </div>
    `, { center: true });
  }

  function dodgeNo() {
    const no = $("#no-button");
    const yes = $('[data-action="yes"]', screen);
    const area = $("#question-actions");
    const msg = $("#no-reaction");
    if (!no || !yes || !area) return;

    state.noCount++;
    const phrases = C.invitation?.noPhrases || ["Кнопка убежала!"];
    if (msg) msg.textContent = phrases[Math.min(state.noCount - 1, phrases.length - 1)];

    // первый раз: фиксируем текущее место, чтобы кнопка поехала плавно
    if (no.style.position !== "absolute") {
      const left = no.offsetLeft;
      const top = no.offsetTop;
      no.style.position = "absolute";
      no.style.left = `${left}px`;
      no.style.top = `${top}px`;
      void no.offsetWidth;
    }

    yes.style.setProperty("--grow", String(Math.min(1.3, 1 + state.noCount * 0.05)));
    no.style.setProperty("--shrink", String(Math.max(0.7, 1 - state.noCount * 0.05)));

    const a = area.getBoundingClientRect();
    const y = yes.getBoundingClientRect();
    const n = no.getBoundingClientRect();
    const maxX = Math.max(0, a.width - n.width);
    const maxY = Math.max(0, a.height - n.height);

    let x = 0, t = 0;
    for (let i = 0; i < 25; i++) {
      x = rand(0, maxX);
      t = rand(0, maxY);
      const nl = a.left + x, nt = a.top + t;
      const overlap = nl < y.right + 10 && nl + n.width > y.left - 10 &&
                      nt < y.bottom + 10 && nt + n.height > y.top - 10;
      if (!overlap) break;
    }
    no.style.left = `${x}px`;
    no.style.top = `${t}px`;
    no.style.rotate = `${rand(-10, 10)}deg`;
  }

  function renderCelebration() {
    const x = C.celebration || {};
    render(`
      <div class="card">
        ${heroArt(SCREEN_GIFS[3])}
        <span class="eyebrow">${esc(x.eyebrow || "♡ ура ♡")}</span>
        <h1>${esc(x.title || "")}</h1>
        <p>${esc(x.description || "")}</p>
        <div class="button-row">${button(x.button || "Придумать встречу", "schedule")}</div>
      </div>
    `, { center: true });
    celebrate();
  }

  function renderSchedule() {
    const x = C.schedule || {};
    render(`
      <div class="card">
        ${heroArt(SCREEN_GIFS[4], true)}
        <span class="eyebrow">${esc(x.eyebrow || "")}</span>
        <h2>${esc(x.title || "")}</h2>
        <p>${esc(x.description || "")}</p>
        <div class="form-grid">
          <div>
            <label class="field-label" for="meet-date">${esc(x.dateLabel || "Дата")}</label>
            <input id="meet-date" type="date" min="${todayStr()}" value="${esc(state.date)}" required>
          </div>
          <div>
            <label class="field-label" for="meet-time">${esc(x.timeLabel || "Время")}</label>
            <input id="meet-time" type="time" value="${esc(state.time)}" required>
          </div>
        </div>
        <p class="validation-error" id="schedule-error" role="alert"></p>
        <div class="button-row">
          ${backButton(2)}
          ${button(x.button || "Дальше", "save-schedule")}
        </div>
      </div>
    `);
  }

  function chip(item, group, selected, added = false) {
    const on = selected.includes(item);
    return `<button type="button" class="option-chip ${on ? "selected" : ""} ${added ? "added" : ""}"
      data-action="toggle-option" data-group="${group}" data-value="${esc(item)}"
      aria-pressed="${on}">${esc(item)}</button>`;
  }

  function chips(items, group) {
    return `<div class="option-grid" id="grid-${group}">${items.map(i => chip(i, group, state[group])).join("")}</div>`;
  }

  function renderPlan() {
    const x = C.plan || {};
    const food = [...(x.food || []), ...state.custom.food];
    const activities = [...(x.activities || []), ...state.custom.activities];

    render(`
      <div class="card">
        ${heroArt(SCREEN_GIFS[5], true)}
        <span class="eyebrow">${esc(x.eyebrow || "")}</span>
        <h2>${esc(x.title || "")}</h2>
        <p>${esc(x.description || "")}</p>

        <section class="option-section">
          <h3>${esc(x.foodLabel || "Еда")}</h3>
          ${chips(food, "food")}
          <div class="custom-row">
            <input id="custom-food" type="text" maxlength="70" placeholder="${esc(x.foodCustom || "Добавить своё")}" aria-label="Свой вариант еды">
            ${button("Добавить", "add-food", "secondary-btn")}
          </div>
        </section>

        <section class="option-section">
          <h3>${esc(x.activityLabel || "Активности")}</h3>
          ${chips(activities, "activities")}
          <div class="custom-row">
            <input id="custom-activity" type="text" maxlength="70" placeholder="${esc(x.activityCustom || "Добавить своё")}" aria-label="Своя активность">
            ${button("Добавить", "add-activity", "secondary-btn")}
          </div>
        </section>

        <section class="option-section">
          <h3>${esc(x.moodLabel || "Атмосфера")}</h3>
          ${chips(x.moods || [], "moods")}
        </section>

        <p class="notice">Можно выбрать несколько вариантов. Выбери хотя бы один в каждом разделе.</p>
        <p class="validation-error" id="plan-error" role="alert"></p>

        <div class="button-row">
          ${backButton(4)}
          ${button(x.button || "Продолжить", "to-notes")}
        </div>
      </div>
    `);
  }

  function renderNotes() {
    const x = C.notes || {};
    render(`
      <div class="card">
        ${heroArt(SCREEN_GIFS[6], true)}
        <span class="eyebrow">${esc(x.eyebrow || "")}</span>
        <h2>${esc(x.title || "")}</h2>
        <p>${esc(x.description || "")}</p>
        <label class="field-label" for="comment">Комментарий</label>
        <textarea id="comment" maxlength="1200" placeholder="${esc(x.placeholder || "")}">${esc(state.comment)}</textarea>
        <div class="button-row">
          ${backButton(5)}
          ${button(x.button || "Посмотреть план", "summary")}
        </div>
      </div>
    `);
  }

  function renderSummary() {
    const x = C.summary || {};
    render(`
      <div class="card">
        ${heroArt(SCREEN_GIFS[7])}
        <span class="eyebrow">${esc(x.eyebrow || "")}</span>
        <h2>${esc(x.title || "")}</h2>
        <p>${esc(x.description || "")}</p>

        <div class="summary-list">
          <div class="summary-item"><strong>📅 Дата и время</strong><span>${esc(fmtDate(state.date))}, ${esc(state.time || "время не выбрано")}</span></div>
          <div class="summary-item"><strong>🍽 Еда и место</strong><span>${esc(val(state.food))}</span></div>
          <div class="summary-item"><strong>🎈 Активности</strong><span>${esc(val(state.activities))}</span></div>
          <div class="summary-item"><strong>✨ Настроение</strong><span>${esc(val(state.moods))}</span></div>
          <div class="summary-item"><strong>💬 Комментарий</strong><span>${esc(state.comment.trim() || "Без дополнительных пожеланий")}</span></div>
        </div>

        <div class="button-row">
          ${button(x.editButton || "Изменить план", "go-5", "ghost-btn")}
          ${button(x.copyButton || "Скопировать", "copy", "secondary-btn")}
        </div>
        <div class="button-row">${button(x.finishButton || "Отправить в Telegram", "finish")}</div>

        <p class="notice" id="send-status" role="status" aria-live="polite">
          Откроется Telegram с готовым сообщением. Если текст не подставился, он уже скопирован — просто вставь его.
        </p>
      </div>
    `);
  }

  /* ---------- Валидация ---------- */
  function validatePlan() {
    const missing = [];
    if (!state.food.length) missing.push("еду или место");
    if (!state.activities.length) missing.push("занятие");
    if (!state.moods.length) missing.push("настроение");

    const error = $("#plan-error");
    if (error) error.textContent = missing.length ? `Нужно выбрать: ${missing.join(", ")}.` : "";

    if (missing.length) {
      error?.scrollIntoView({ behavior: state.motion ? "smooth" : "auto", block: "center" });
      return false;
    }
    return true;
  }

  function validateSchedule() {
    const date = $("#meet-date")?.value;
    const time = $("#meet-time")?.value;
    const error = $("#schedule-error");
    const fail = text => { if (error) error.textContent = text; return false; };

    if (!date || !time) return fail("Выбери дату и время, чтобы продолжить.");
    if (date < todayStr()) return fail("Выбери сегодняшнюю или будущую дату.");
    if (date === todayStr() && time < nowTimeStr()) return fail("Это время уже прошло. Выбери время позже.");

    state.date = date;
    state.time = time;
    return true;
  }

  /* ---------- Telegram ---------- */
  function buildMessage() {
    const lines = list => list.length ? list.map(v => "• " + v).join("\n") : "• не выбрано";
    return [
      "💌 Мой ответ на приглашение", "",
      "📅 Дата: " + fmtDate(state.date),
      "🕐 Время: " + (state.time || "не выбрано"), "",
      "🍽 Еда / место:", lines(state.food), "",
      "🎈 Чем займёмся:", lines(state.activities), "",
      "✨ Настроение:", lines(state.moods), "",
      "💬 Пожелания:", state.comment.trim() || "Без дополнительных пожеланий"
    ].join("\n");
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        return ok;
      } catch (e2) {
        return false;
      }
    }
  }

  async function copyPlan() {
    const ok = await copyText(buildMessage());
    toast(ok ? "План скопирован 💌" : "Не получилось скопировать");
  }

  async function sendToTelegram(clickEvent) {
    const username = String(C.telegram?.username || "").trim().replace(/^@/, "");
    const status = $("#send-status");

    if (!/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(username)) {
      if (status) status.textContent = "Отправка не настроена: укажи telegram.username в config.js.";
      return;
    }

    const message = buildMessage();
    // слишком длинный текст может не поместиться в ссылку, полный вариант всё равно копируется
    const short = message.length > 900 ? message.slice(0, 900) + "…" : message;
    const url = `https://t.me/${username}?text=${encodeURIComponent(short)}`;

    const copied = await copyText(message);

    if (clickEvent) burst(clickEvent.clientX, clickEvent.clientY, 14);
    toast(copied ? "Скопировано, открываю Telegram…" : "Открываю Telegram…");

    if (status) {
      status.textContent = "Если Telegram не открылся, нажми на ссылку: ";
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "открыть чат";
      status.appendChild(a);
    }

    window.setTimeout(() => { window.location.href = url; }, state.motion ? 450 : 0);
  }

  /* ---------- Эффекты ---------- */
  function palette() {
    const p = (C.palettes || [])[state.step];
    return [p?.primary || "#ee7ba6", "#ffd27a", "#a8dcc9", "#b9a5ee", "#f59bb4", "#8fc3f5"];
  }

  function celebrate() {
    if (!state.motion) return;

    if (C.effects?.confetti !== false) {
      const colors = palette();
      const count = Math.min(90, Math.max(0, Number(C.animation?.confettiCount ?? 46)));
      for (let i = 0; i < count; i++) {
        const el = document.createElement("i");
        el.className = "confetti" + (i % 3 === 0 ? " round" : "");
        el.style.left = `${rand(0, 100)}%`;
        el.style.background = colors[i % colors.length];
        el.style.setProperty("--drift", `${rand(-90, 90)}px`);
        el.style.setProperty("--fall", `${rand(2.0, 3.8)}s`);
        el.style.setProperty("--spin", `${rand(360, 900)}deg`);
        el.style.animationDelay = `${rand(0, 0.7)}s`;
        effectsLayer.appendChild(el);
        window.setTimeout(() => el.remove(), 5000);
      }
    }

    if (C.effects?.floatingHearts !== false) {
      for (let i = 0; i < 10; i++) {
        const el = document.createElement("span");
        el.className = "float-heart";
        el.textContent = ["♡", "♥", "✦"][i % 3];
        el.style.left = `${rand(5, 95)}%`;
        el.style.color = palette()[i % 2 === 0 ? 0 : 4];
        el.style.fontSize = `${rand(16, 36)}px`;
        el.style.animationDelay = `${rand(0, 0.9)}s`;
        effectsLayer.appendChild(el);
        window.setTimeout(() => el.remove(), 4200);
      }
    }
  }

  function burst(x, y, n = 10) {
    if (!state.motion) return;
    const glyphs = ["♥", "♡", "✦", "♥"];
    const colors = palette();
    for (let i = 0; i < n; i++) {
      const el = document.createElement("span");
      const angle = (Math.PI * 2 * i) / n + rand(-0.3, 0.3);
      const dist = rand(60, 150);
      el.className = "burst-heart";
      el.textContent = glyphs[i % glyphs.length];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.color = colors[i % colors.length];
      el.style.fontSize = `${rand(14, 28)}px`;
      el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      el.style.setProperty("--dy", `${Math.sin(angle) * dist - 30}px`);
      el.style.setProperty("--rot", `${rand(-40, 40)}deg`);
      effectsLayer.appendChild(el);
      window.setTimeout(() => el.remove(), 1200);
    }
  }

  function toast(message) {
    $(".toast")?.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = message;
    document.body.appendChild(el);
    window.setTimeout(() => el.remove(), 2600);
  }

  /* ---------- Свои варианты и выбор чипов (без перерисовки экрана) ---------- */
  function toggleChip(target) {
    const group = target.dataset.group;
    const value = target.dataset.value;
    if (!["food", "activities", "moods"].includes(group)) return;

    const list = state[group];
    const idx = list.indexOf(value);
    if (idx >= 0) list.splice(idx, 1); else list.push(value);

    const on = idx < 0;
    target.classList.toggle("selected", on);
    target.setAttribute("aria-pressed", String(on));
    target.classList.remove("pop", "added");
    void target.offsetWidth;
    if (state.motion) target.classList.add("pop");

    if (on) {
      const r = target.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 4);
    }
    $("#plan-error").textContent = "";
  }

  function addCustom(group) {
    const input = group === "food" ? $("#custom-food") : $("#custom-activity");
    const value = input?.value.trim();

    if (!value) {
      toast("Сначала введи свой вариант.");
      input?.focus();
      return;
    }

    const base = (group === "food" ? C.plan?.food : C.plan?.activities) || [];
    const exists = [...base, ...state.custom[group]].some(v => v.toLowerCase() === value.toLowerCase());

    if (!exists) state.custom[group].push(value);
    const real = [...base, ...state.custom[group]].find(v => v.toLowerCase() === value.toLowerCase());
    if (!state[group].includes(real)) state[group].push(real);

    const grid = $(`#grid-${group}`);
    let chipEl = $$(".option-chip", grid).find(b => b.dataset.value === real);
    if (!chipEl) {
      grid.insertAdjacentHTML("beforeend", chip(real, group, state[group], true));
    } else {
      chipEl.classList.add("selected");
      chipEl.setAttribute("aria-pressed", "true");
    }

    input.value = "";
    input.focus({ preventScroll: true });
  }

  /* ---------- События ---------- */
  screen.addEventListener("click", event => {
    const heroBox = event.target.closest(".hero-art");
    if (heroBox) {
      heroBox.classList.remove("bounce");
      void heroBox.offsetWidth;
      if (state.motion) heroBox.classList.add("bounce");
      const r = heroBox.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 3, 7);
      return;
    }

    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    switch (action) {
      case "start": return go(1);
      case "open-letter": return openLetter();
      case "yes":
        burst(event.clientX, event.clientY, 14);
        return go(3);
      case "no": return dodgeNo();
      case "schedule": return go(4);
      case "save-schedule":
        if (validateSchedule()) go(5);
        return;
      case "toggle-option": return toggleChip(target);
      case "add-food": return addCustom("food");
      case "add-activity": return addCustom("activities");
      case "to-notes":
        if (validatePlan()) go(6);
        return;
      case "summary": return go(7);
      case "copy": return copyPlan();
      case "finish": return sendToTelegram(event);
      default:
        if (action.startsWith("go-")) return go(Number(action.slice(3)));
    }
  });

  // кнопка «Нет» убегает ещё до клика, если это мышь
  screen.addEventListener("pointerover", event => {
    if (event.pointerType !== "mouse") return;
    if (event.target.closest("#no-button")) dodgeNo();
  });

  // конверт открывается с клавиатуры
  screen.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.id === "envelope") {
      event.preventDefault();
      openLetter();
    }
    if (event.key === "Enter" && event.target.id === "custom-food") {
      event.preventDefault();
      addCustom("food");
    }
    if (event.key === "Enter" && event.target.id === "custom-activity") {
      event.preventDefault();
      addCustom("activities");
    }
  });

  screen.addEventListener("input", event => {
    if (event.target.id === "comment") state.comment = event.target.value;
    if (event.target.id === "meet-date") state.date = event.target.value;
    if (event.target.id === "meet-time") state.time = event.target.value;
  });

  $("#motion-toggle")?.addEventListener("click", () => {
    state.motion = !state.motion;
    syncMotionUI();
    toast(state.motion ? "Анимации включены" : "Анимации отключены");
  });

  /* ---------- Старт ---------- */
  setBaseTheme();
  initBgHearts();
  renderStep();
})();
