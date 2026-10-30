/* РЕДАКТИРУЙ ЭТОТ ФАЙЛ: тексты, цвета, гифки и варианты. */
window.INVITE_CONFIG = {
  pageTitle: "Маленькое приглашение",
  footerText: "сделано с теплом · v3",

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
    text: "#3d4460",
    muted: "#6f7592"
  },
  palettes: [
    { bg: "#eef3ff", primary: "#7f93ee", primaryDark: "#5d70d4", blobA: "#cddaff", blobB: "#e7d6ff", blobC: "#ffd6e6" }, // 0 старт
    { bg: "#f1efff", primary: "#9b8cf0", primaryDark: "#7a6ad6", blobA: "#ddd6ff", blobB: "#cfe3ff", blobC: "#ffd6e6" }, // 1 конверт
    { bg: "#eaf4ff", primary: "#6fa8ee", primaryDark: "#4f8bd6", blobA: "#c8e0ff", blobB: "#e2d6ff", blobC: "#ffd6e4" }, // 2 вопрос
    { bg: "#f4eeff", primary: "#b07fe8", primaryDark: "#8f5ccc", blobA: "#e2d2ff", blobB: "#ffc9e0", blobC: "#cfe6ff" }, // 3 ура
    { bg: "#ebf6ff", primary: "#6bb5e8", primaryDark: "#4896cc", blobA: "#c3e6ff", blobB: "#dcd6ff", blobC: "#d3f0ee" }, // 4 дата
    { bg: "#edf1ff", primary: "#7d8ff0", primaryDark: "#5b6ed6", blobA: "#cbd5ff", blobB: "#e6d9ff", blobC: "#c8ecff" }, // 5 план
    { bg: "#f2eeff", primary: "#9a86ee", primaryDark: "#7a66d4", blobA: "#dcd2ff", blobB: "#c9defd", blobC: "#ffd6e6" }, // 6 детали
    { bg: "#eff3ff", primary: "#8296f0", primaryDark: "#6075d6", blobA: "#d0dbff", blobB: "#ead9ff", blobC: "#ffd9e8" }  // 7 итог
  ],

  animation: {
    enabled: true,
    durationMs: 380,
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
