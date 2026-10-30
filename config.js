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
    { bg: "#fff1f6", primary: "#ee7ba6", primaryDark: "#d0588a", blobA: "#ffd3e3", blobB: "#e6dcff", blobC: "#ffe7d6" }, // 0 старт
    { bg: "#fff3ee", primary: "#f2998f", primaryDark: "#d9756d", blobA: "#ffd9cc", blobB: "#ffd3e3", blobC: "#fff0c9" }, // 1 конверт
    { bg: "#fcf0fb", primary: "#e07cc0", primaryDark: "#bd58a0", blobA: "#f6cdf0", blobB: "#dcd9ff", blobC: "#ffd3e3" }, // 2 вопрос
    { bg: "#fff0f3", primary: "#f2698f", primaryDark: "#d44a74", blobA: "#ffc9d8", blobB: "#ffe3b8", blobC: "#e6dcff" }, // 3 ура
    { bg: "#f1f3ff", primary: "#8f9cef", primaryDark: "#6b78d1", blobA: "#d6dcff", blobB: "#f4d4ff", blobC: "#cfeaff" }, // 4 дата
    { bg: "#eef6ff", primary: "#7fb0ee", primaryDark: "#5a8fd2", blobA: "#cfe5ff", blobB: "#e6dcff", blobC: "#ffd9e6" }, // 5 план
    { bg: "#f6f0ff", primary: "#a98af0", primaryDark: "#8566d6", blobA: "#e3d6ff", blobB: "#ffd3e3", blobC: "#d3ecff" }, // 6 детали
    { bg: "#fff1f6", primary: "#ee7ba6", primaryDark: "#d0588a", blobA: "#ffd3e3", blobB: "#e6dcff", blobC: "#ffe7d6" }  // 7 итог
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
