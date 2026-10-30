(() => {
  "use strict";
  const C = window.INVITE_CONFIG || {};
  const $ = (s, root = document) => root.querySelector(s);
  const screen = $("#screen");
  const progress = $("#progress-bar");
  const stepLabel = $("#step-label");
  const effectsLayer = $("#effects-layer");
  const state = {
    step: 0, date: "", time: "", food: [], activities: [], moods: [], customFood: "",
    customActivities: "", comment: "", noCount: 0, motion: C.animation?.enabled !== false
  };
  const steps = ["начало", "открытка", "приглашение", "ура!", "дата и время", "план встречи", "пожелания", "готово"];

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, ch => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[ch]));
  }
  function setTheme() {
    const t = C.theme || {};
    const root = document.documentElement;
    Object.entries({
      "--bg":t.background, "--surface":t.surface, "--text":t.text, "--muted":t.muted,
      "--primary":t.primary, "--primary-dark":t.primaryDark, "--accent":t.accent, "--border":t.border
    }).forEach(([k,v]) => { if (v) root.style.setProperty(k,v); });
    if (C.animation?.durationMs) root.style.setProperty("--duration", `${Math.max(0, Number(C.animation.durationMs))}ms`);
    document.title = C.pageTitle || "Приглашение";
    $("#footer-note").textContent = C.footerText || "";
    document.body.classList.toggle("reduce-motion", !state.motion);
    $("#motion-toggle").textContent = state.motion ? "✦" : "○";
  }
  function updateProgress() {
    progress.style.width = `${Math.max(8, (state.step + 1) / steps.length * 100)}%`;
    stepLabel.textContent = steps[state.step] || "приглашение";
  }
  function render(html, center = false) {
    screen.classList.remove("exiting");
    screen.innerHTML = html;
    if (center) screen.classList.add("center");
    updateProgress();
    if (state.motion) screen.animate([{opacity:0, transform:"translateY(10px)"},{opacity:1, transform:"translateY(0)"}], {duration:C.animation?.durationMs || 420, easing:"cubic-bezier(.2,.8,.2,1)"});
  }
  function next(step) {
    screen.classList.add("exiting");
    window.setTimeout(() => { state.step = step; renderStep(); }, state.motion ? 150 : 0);
  }
  function heroArt(gif = "opening.gif") {
  return `
    <div class="hero-art" aria-hidden="true">
      <img
        class="custom-gif"
        src="./gifs/${gif}"
        alt=""
      >
    </div>
  `;
}
  function button(text, action, cls = "primary-btn", attrs = "") {
    return `<button type="button" class="${cls}" data-action="${action}" ${attrs}>${escapeHTML(text)}</button>`;
  }
  function backButton(target) { return button(C.labels?.back || "Назад", `go-${target}`, "ghost-btn"); }

  function renderStep() {
    setTheme();
    switch (state.step) {
      case 0: return renderOpening();
      case 1: return renderEnvelope();
      case 2: return renderInvitation();
      case 3: return renderCelebration();
      case 4: return renderSchedule();
      case 5: return renderPlan();
      case 6: return renderNotes();
      case 7: return renderSummary();
      default: state.step = 0; return renderOpening();
    }
  }
  function renderOpening() {
    const x = C.opening || {};
    render(`<div class="card center">
      ${heroArt("hi.gif")}
      <span class="eyebrow">${escapeHTML(x.eyebrow || "")}</span>
      <h1>${escapeHTML(x.title || "Приглашение для тебя")}</h1>
      <p>${escapeHTML((x.description || "").replaceAll("{recipient}", C.recipientName || ""))}</p>
      <div class="button-row">${button(x.button || "Начать", "start")}</div>
    </div>`, true);
  }
  function renderEnvelope() {
    const x = C.envelope || {};
    render(`<div class="card center">
      <span class="eyebrow">${escapeHTML(x.eyebrow || "")}</span>
      <div class="envelope-wrap" id="envelope"><div class="envelope"><div class="letter"></div></div><div class="flap"></div><div class="seal">${escapeHTML(x.seal || "♡")}</div></div>
      <h2>${escapeHTML(x.title || "")}</h2><p>${escapeHTML(x.description || "")}</p>
      <div class="button-row">${button(x.button || "Открыть", "open-letter")}</div>
    </div>`, true);
    const delay = state.motion ? Math.max(0, Number(C.animation?.envelopeDelayMs || 0)) : 0;
    const btn = $('[data-action="open-letter"]');
    if (btn) { btn.disabled = true; btn.style.opacity = ".55"; window.setTimeout(() => { btn.disabled = false; btn.style.opacity = "1"; }, delay); }
  }
  function renderInvitation() {
    const x = C.invitation || {};
    render(`<div class="card center">
      ${heroArt("lovely.gif")}
      <span class="eyebrow">${escapeHTML(x.eyebrow || "")}</span>
      <h1>${escapeHTML(x.title || "")}</h1><p>${escapeHTML(x.description || "")}</p>
      <div class="question-actions" id="question-actions">
        ${button(x.yes || "Да!", "yes", "primary-btn")}
        <button type="button" class="no-btn" id="no-button" data-action="no">${escapeHTML(x.no || "Нет")}</button>
      </div>
      <p class="notice" id="no-reaction" aria-live="polite"></p>
    </div>`, true);
  }
  function renderCelebration() {
    const x = C.celebration || {};
    render(`<div class="card center" id="celebrate-card">
      ${heroArt("verylovely.gif")}
      <span class="eyebrow">♡ ${escapeHTML(C.recipientName || "для тебя")} ♡</span>
      <h1>${escapeHTML(x.title || "")}</h1><p>${escapeHTML(x.description || "")}</p>
      <div class="button-row">${button("Придумать встречу", "schedule")}</div>
    </div>`, true);
    celebrate();
  }
  function renderSchedule() {
    const x = C.schedule || {};
    const today = new Date(); const minDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    render(`<div class="card">
      <span class="eyebrow">${escapeHTML(x.eyebrow || "")}</span><h2>${escapeHTML(x.title || "")}</h2><p>${escapeHTML(x.description || "")}</p>
      <div class="form-grid">
        <div><label class="field-label" for="meet-date">${escapeHTML(x.dateLabel || "Дата")}</label><input id="meet-date" type="date" min="${minDate}" value="${escapeHTML(state.date)}" required></div>
        <div><label class="field-label" for="meet-time">${escapeHTML(x.timeLabel || "Время")}</label><input id="meet-time" type="time" value="${escapeHTML(state.time)}" required></div>
      </div>
      <p class="notice" id="schedule-error" role="alert"></p>
      <div class="button-row">${backButton(2)}${button(x.button || "Дальше", "save-schedule")}</div>
    </div>`);
  }
  function optionChips(items, selected, group) {
    return `<div class="option-grid">${items.map(item => `<button type="button" class="option-chip ${selected.includes(item) ? "selected" : ""}" data-action="toggle-option" data-group="${group}" data-value="${escapeHTML(item)}" aria-pressed="${selected.includes(item)}">${escapeHTML(item)}</button>`).join("")}</div>`;
  }
  function renderPlan() {
    const x = C.plan || {};
    const food = [...(x.food || []), ...(state.customFood ? [state.customFood] : [])];
    const activities = [...(x.activities || []), ...(state.customActivities ? [state.customActivities] : [])];
    render(`<div class="card">
      <span class="eyebrow">${escapeHTML(x.eyebrow || "")}</span><h2>${escapeHTML(x.title || "")}</h2><p>${escapeHTML(x.description || "")}</p>
      <section class="option-section"><h3>${escapeHTML(x.foodLabel || "Еда")}</h3>${optionChips(food, state.food, "food")}
        <div class="custom-row"><input id="custom-food" type="text" maxlength="70" placeholder="Добавить еду или место" aria-label="Свой вариант еды">${button("Добавить", "add-food", "secondary-btn")}</div>
      </section>
      <section class="option-section"><h3>${escapeHTML(x.activityLabel || "Активности")}</h3>${optionChips(activities, state.activities, "activities")}
        <div class="custom-row"><input id="custom-activity" type="text" maxlength="70" placeholder="Добавить активность" aria-label="Своя активность">${button("Добавить", "add-activity", "secondary-btn")}</div>
      </section>
      <section class="option-section"><h3>${escapeHTML(x.moodLabel || "Атмосфера")}</h3>${optionChips(x.moods || [], state.moods, "moods")}</section>
      <p class="notice">Можно выбрать несколько вариантов. Обязательно выбери хотя бы один вариант в каждом разделе.</p>
      <p class="validation-error" id="plan-error" role="alert" aria-live="polite"></p>
      <div class="button-row">${backButton(4)}${button(x.button || "Продолжить", "to-notes")}</div>
    </div>`);
  }
  function renderNotes() {
    const x = C.notes || {};
    render(`<div class="card">
      <span class="eyebrow">${escapeHTML(x.eyebrow || "")}</span><h2>${escapeHTML(x.title || "")}</h2><p>${escapeHTML(x.description || "")}</p>
      <label class="field-label" for="comment">Комментарий</label>
      <textarea id="comment" maxlength="1200" placeholder="${escapeHTML(x.placeholder || "")}">${escapeHTML(state.comment)}</textarea>
      <p class="notice">Комментарий останется в этой сессии браузера, пока страница открыта.</p>
      <div class="button-row">${backButton(5)}${button(x.button || "Посмотреть план", "summary")}</div>
    </div>`);
  }
  function fmtDate(date) {
    if (!date) return "Не выбрана";
    const d = new Date(`${date}T12:00:00`);
    return new Intl.DateTimeFormat("ru-RU", {day:"numeric", month:"long", year:"numeric"}).format(d);
  }
  function val(list) { return list.length ? list.join(", ") : (C.labels?.empty || "Пока не выбрано"); }
  function renderSummary() {
    const x = C.summary || {};
    render(`<div class="card">
      ${heroArt("kaif.gif")}
      <span class="eyebrow">${escapeHTML(x.eyebrow || "")}</span><h2>${escapeHTML(x.title || "")}</h2><p>${escapeHTML(x.description || "")}</p>
      <div class="summary-list">
        <div class="summary-item"><strong>Дата и время</strong><span>${escapeHTML(fmtDate(state.date))} · ${escapeHTML(state.time || "Не выбрано")}</span></div>
        <div class="summary-item"><strong>Еда и место</strong><span>${escapeHTML(val(state.food))}</span></div>
        <div class="summary-item"><strong>Активности</strong><span>${escapeHTML(val(state.activities))}</span></div>
        <div class="summary-item"><strong>Атмосфера</strong><span>${escapeHTML(val(state.moods))}</span></div>
        <div class="summary-item"><strong>Комментарий</strong><span>${escapeHTML(state.comment.trim() || "Без дополнительных пожеланий")}</span></div>
      </div>
      <div class="button-row">${button(x.editButton || "Изменить план", "go-4", "ghost-btn")}${button(x.finishButton || "Отправить в Telegram", "finish")}</div>
      <p class="notice" id="send-status" role="status" aria-live="polite">Нажми кнопку ниже: откроется Telegram с готовым сообщением, останется только нажать «Отправить».</p>
    </div>`);
  }
  function validatePlan() {
    const missing = [];
    if (!state.food.length) missing.push("еду или место");
    if (!state.activities.length) missing.push("активность");
    if (!state.moods.length) missing.push("настроение");
    const error = $("#plan-error");
    if (error) {
      error.textContent = missing.length
        ? `Нужно выбрать: ${missing.join(", ")}.`
        : "";
    }
    if (missing.length) {
      if (error) error.scrollIntoView({behavior: state.motion ? "smooth" : "auto", block: "center"});
      return false;
    }
    return true;
  }

  function buildMessage() {
    const lines = (list) => list.length ? list.map(v => "• " + v).join("\n") : "• не выбрано";
    return [
      "💌 Мой ответ на приглашение",
      "",
      "📅 Дата: " + fmtDate(state.date),
      "🕐 Время: " + (state.time || "не выбрано"),
      "",
      "🍽 Еда / место:",
      lines(state.food),
      "",
      "🎈 Чем займёмся:",
      lines(state.activities),
      "",
      "✨ Настроение:",
      lines(state.moods),
      "",
      "💬 Пожелания:",
      state.comment.trim() || "Без дополнительных пожеланий"
    ].join("\n");
  }

  function sendToTelegram() {
    const username = String(C.telegram?.username || "").trim().replace(/^@/, "");
    const status = $("#send-status");
    if (!/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(username)) {
      if (status) status.textContent = "Отправка пока не настроена. Укажи telegram.username в config.js.";
      return;
    }
    const message = buildMessage();
    // Копируем текст заранее: если Telegram не подставит его сам, останется только вставить.
    try { navigator.clipboard?.writeText(message).catch(() => {}); } catch (e) {}
    const url = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
    if (status) status.textContent = "Открываю Telegram. Нажми «Отправить». Если текста в поле нет, просто вставь его: он уже скопирован.";
    toast("Открываю Telegram…");
    window.location.href = url;
  }

  function celebrate() {
    if (!state.motion) return;
    const card = $("#celebrate-card");
    card?.classList.add("shake");
    if (C.effects?.confetti !== false) {
      const colors = [C.theme?.primary || "#ed78a4", "#f8c76a", "#a8d8c8", "#b9a5ee", "#f59bb4"];
      const count = Math.min(80, Math.max(0, Number(C.animation?.confettiCount ?? 34)));
      for (let i = 0; i < count; i++) {
        const el = document.createElement("i"); el.className = "confetti";
        el.style.left = `${Math.random()*100}%`; el.style.background = colors[i % colors.length];
        el.style.setProperty("--drift", `${Math.random()*150-75}px`);
        el.style.setProperty("--fall", `${1.7+Math.random()*1.8}s`);
        el.style.animationDelay = `${Math.random()*.5}s`; effectsLayer.appendChild(el);
        window.setTimeout(() => el.remove(), 4500);
      }
    }
    if (C.effects?.floatingHearts !== false) {
      for (let i=0;i<9;i++) {
        const el = document.createElement("span"); el.className = "float-heart"; el.textContent = ["♡","♥","✦"][i%3];
        el.style.left = `${5+Math.random()*90}%`; el.style.color = C.theme?.primary || "#ed78a4";
        el.style.fontSize = `${16+Math.random()*22}px`; el.style.animationDelay = `${Math.random()*.7}s`;
        effectsLayer.appendChild(el); window.setTimeout(() => el.remove(), 3500);
      }
    }
  }
  function toast(message) {
    $(".toast")?.remove();
    const el = document.createElement("div"); el.className = "toast"; el.setAttribute("role","status"); el.textContent = message;
    document.body.appendChild(el); window.setTimeout(() => el.remove(), 2600);
  }
  function addCustom(type) {
    const input = type === "food" ? $("#custom-food") : $("#custom-activity");
    const value = input?.value.trim();
    if (!value) { toast("Сначала введи свой вариант."); return; }
    if (type === "food") { state.customFood = value; state.food.push(value); }
    else { state.customActivities = value; state.activities.push(value); }
    renderPlan();
  }
  screen.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "start") next(1);
    else if (action === "open-letter") {
      const env = $("#envelope"); env?.classList.add("open");
      target.disabled = true;
      window.setTimeout(() => next(2), state.motion ? 720 : 0);
    } else if (action === "yes") next(3);
    else if (action === "no") {
      state.noCount++;
      const no = $("#no-button"), area = $("#question-actions"), msg = $("#no-reaction");
      if (!no || !area) return;
      const phrases = ["Хм… кнопка решила поиграть!", "Кажется, она стесняется.", "Может, всё-таки «Да»?"];
      msg.textContent = phrases[(state.noCount-1) % phrases.length];
      no.style.position = "absolute";
      const rect = area.getBoundingClientRect(), nr = no.getBoundingClientRect();
      const maxX = Math.max(0, area.clientWidth - nr.width), maxY = 24;
      no.style.left = `${Math.random()*maxX}px`;
      no.style.top = `${Math.random()*maxY}px`;
      no.style.transform = `rotate(${Math.random()*12-6}deg)`;
    } else if (action === "schedule") next(4);
    else if (action === "save-schedule") {
      const date = $("#meet-date")?.value, time = $("#meet-time")?.value;
      const error = $("#schedule-error");
      if (!date || !time) { if(error) error.textContent = "Выбери дату и время, чтобы продолжить."; return; }
      if (date < $("#meet-date").min) { if(error) error.textContent = "Выбери сегодняшнюю или будущую дату."; return; }
      state.date = date; state.time = time; next(5);
    } else if (action === "toggle-option") {
      const group = target.dataset.group, value = target.dataset.value;
      if (!["food","activities","moods"].includes(group)) return;
      const list = state[group], idx = list.indexOf(value);
      if (idx >= 0) list.splice(idx,1); else list.push(value);
      renderPlan();
    } else if (action === "add-food") addCustom("food");
    else if (action === "add-activity") addCustom("activities");
    else if (action === "to-notes") {
      if (validatePlan()) next(6);
    }
    else if (action === "summary") { state.comment = $("#comment")?.value || ""; next(7); }
    else if (action === "finish") sendToTelegram();
    else if (action.startsWith("go-")) {
      if (action === "go-4") { state.comment = $("#comment")?.value ?? state.comment; next(4); }
      else next(Number(action.slice(3)));
    }
  });
  $("#motion-toggle").addEventListener("click", () => {
    state.motion = !state.motion; setTheme();
    toast(state.motion ? "Анимации включены" : "Анимации отключены");
  });
  // Prevent native hover/click quirks on touch and keep date/time values in memory during navigation.
  screen.addEventListener("change", (event) => {
    if (event.target.id === "meet-date") state.date = event.target.value;
    if (event.target.id === "meet-time") state.time = event.target.value;
    if (event.target.id === "comment") state.comment = event.target.value;
  });
  setTheme();
  renderStep();
})();
