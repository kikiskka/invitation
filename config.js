/* РЕДАКТИРУЙ ЭТОТ ФАЙЛ: тексты, цвета, гифки и варианты. */
window.INVITE_CONFIG = {
  pageTitle: "Маленькое приглашение",
  footerText: "сделано с теплом",

  // Твой публичный username в Telegram (без @).
  telegram: {
    username: "kikiskka"
  },

  /* ---------- ГИФКИ ----------
     Файлы лежат в папке gifs/ (если файла там нет, ищется рядом с index.html).
     На экране с конвертом гифки нет — так и задумано.
     Если файла нет совсем, вместо гифки появится милый эмодзи. */
  gifBase: "gifs/",
  gifs: {
    opening: "hi.gif",           // стартовый экран
    invitation: "lovely.gif",    // вопрос «Проведём время вместе?»
    celebration: "verylovely.gif", // «Ура!»
    schedule: "time.gif",        // дата и время
    plan: "plan.gif",            // что будем делать
    notes: "write.gif",          // детали
    summary: "kaif.gif"          // итоговый план
  },
  gifFallback: {
    opening: "🐱",
    invitation: "🥺",
    celebration: "🥳",
    schedule: "🗓️",
    plan: "🍰",
    notes: "✍️",
    summary: "😽"
  },

  /* ---------- ЦВЕТА ----------
     Светлые пастельные палитры, подобранные под розово-серо-голубую гамму.
     Цвет мягко перетекает от экрана к экрану (порядок = номер шага). */
  theme: {
    text: "#4b3a55",
    muted: "#7e6a8a"
  },
  palettes: [
    { bg: "#f3efff", primary: "#f2709f", primaryDark: "#cf4b80", blobA: "#ffc4da", blobB: "#c9d6ff", blobC: "#e6d2ff" }, // 0 старт: лавандовый
    { bg: "#fff0e8", primary: "#f59a86", primaryDark: "#d9705f", blobA: "#ffd0bd", blobB: "#ffc4da", blobC: "#fff0b8" }, // 1 конверт: персиковый
    { bg: "#ffeef6", primary: "#ec6fb5", primaryDark: "#c4478f", blobA: "#ffc2e2", blobB: "#d6d2ff", blobC: "#ffd9e6" }, // 2 вопрос: розовая жвачка
    { bg: "#ffeceb", primary: "#f2607f", primaryDark: "#d13e61", blobA: "#ffbfcb", blobB: "#ffdca8", blobC: "#e3d4ff" }, // 3 ура: клубничный
    { bg: "#ecf1ff", primary: "#7f95f0", primaryDark: "#5c72d6", blobA: "#c6d3ff", blobB: "#f0cdff", blobC: "#c3e8ff" }, // 4 дата: васильковый
    { bg: "#e8f5ff", primary: "#6fb2ee", primaryDark: "#4a91d4", blobA: "#bfe0ff", blobB: "#dcd2ff", blobC: "#ffd0e0" }, // 5 план: небесный
    { bg: "#f1ebff", primary: "#a583f2", primaryDark: "#8160d8", blobA: "#dccfff", blobB: "#ffc8dc", blobC: "#c9e6ff" }, // 6 детали: сиреневый
    { bg: "#fff0f5", primary: "#f2709f", primaryDark: "#cf4b80", blobA: "#ffc4da", blobB: "#d6d2ff", blobC: "#ffe0cc" }  // 7 итог: нежно-розовый
  ],

  animation: {
    enabled: true,
    durationMs: 520,
    confettiCount: 46
  },

  opening: {
    eyebrow: "для особенного человека",
    title: "У меня есть кое-что для тебя",
    description: "Небольшое приглашение, которое хочется открыть не спеша.",
    button: "Начать"
  },
  envelope: {
    eyebrow: "письмо для тебя",
    title: "Тук-тук… там кое-что внутри",
    description: "Готов(а) открыть маленький секрет?",
    button: "Открыть письмо",
    seal: "♡"
  },
  invitation: {
    eyebrow: "важный вопрос",
    title: "Проведём время вместе?",
    description: "Я придумал(а) маленькое приключение. Хочешь составить его вместе?",
    yes: "Да, давай!",
    no: "Нет",
    noPhrases: [
      "Хм… кнопка решила поиграть!",
      "Кажется, она стесняется.",
      "Она убегает, а «Да» всё растёт 👀",
      "Может, всё-таки «Да»?",
      "Ладно-ладно, жми «Да» 💗"
    ]
  },
  celebration: {
    eyebrow: "♡ ура ♡",
    title: "Ура! Это будет здорово!",
    description: "Теперь давай придумаем нашу встречу.",
    button: "Придумать встречу"
  },
  schedule: {
    eyebrow: "шаг 1 из 3",
    title: "Когда увидимся?",
    description: "Выбери удобные дату и время. Это пока предложение — их можно изменить.",
    dateLabel: "Дата",
    timeLabel: "Время",
    button: "Дальше"
  },
  plan: {
    eyebrow: "шаг 2 из 3",
    title: "Что будем делать?",
    description: "Выбирай несколько вариантов или добавь свой.",
    foodLabel: "Что вкусного?",
    activityLabel: "Чем займёмся?",
    moodLabel: "Какое настроение?",
    foodCustom: "Добавить своё: еду или место",
    activityCustom: "Добавить своё занятие",
    button: "Продолжить",
    // Вариант «Свой вариант» убран: для этого есть поле добавления.
    food: ["Кафе", "Пицца", "Суши", "Десерт", "Домашний ужин"],
    activities: ["Прогулка", "Кино", "Настольные игры", "Пикник", "Интересное место", "Спокойный вечер"],
    moods: ["Уютно", "Романтично", "Весело", "Спонтанно", "Спокойно"]
  },
  notes: {
    eyebrow: "шаг 3 из 3",
    title: "Добавим детали?",
    description: "Напиши пожелания, идеи или то, что хочется поменять.",
    placeholder: "Например: хочу попробовать новое кафе…",
    button: "Посмотреть план"
  },
  summary: {
    eyebrow: "наш план",
    title: "Кажется, нас ждёт хороший день",
    description: "Вот что у нас получилось. Можно вернуться и всё изменить.",
    editButton: "Изменить план",
    copyButton: "Скопировать",
    finishButton: "Отправить в Telegram 💌"
  },
  labels: {
    back: "Назад",
    empty: "Пока не выбрано"
  },
  effects: {
    confetti: true,
    floatingHearts: true
  }
};
