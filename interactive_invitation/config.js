/* РЕДАКТИРУЙ ЭТОТ ФАЙЛ: тексты, цвета, анимации и варианты. */
window.INVITE_CONFIG = {
  senderName: "Твоё имя",
  recipientName: "Твоё имя",
  pageTitle: "Маленькое приглашение",
  footerText: "сделано с теплом",
  // Вставь URL опубликованного Google Apps Script Web App (оканчивается на /exec).
  // Токен Telegram-бота здесь НЕ хранить — он задаётся только в настройках Apps Script.
  telegram: {
    webAppUrl: "https://script.google.com/macros/s/AKfycbxrQgpo4UdqejznUZ8zYB1zp_moaTgIBTrLLXYeHqKf6C9-IN3kgSalJ8FUFkI4CUtetw/exec"
  },
  theme: {
    background: "#fff4f7",
    surface: "rgba(255,255,255,.82)",
    text: "#492c3b",
    muted: "#987789",
    primary: "#ed78a4",
    primaryDark: "#c64f80",
    accent: "#ffe1eb",
    border: "rgba(199, 112, 151, .2)"
  },
  animation: {
    enabled: true,
    durationMs: 420,
    introDelayMs: 700,
    envelopeDelayMs: 450,
    confettiCount: 34
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
    no: "Нет"
  },
  celebration: {
    title: "Ура! Это будет здорово!",
    description: "Теперь давай придумаем нашу встречу."
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
    button: "Продолжить",
    food: ["Кафе", "Пицца", "Суши", "Десерт", "Домашний ужин", "Свой вариант"],
    activities: ["Прогулка", "Кино", "Настольные игры", "Пикник", "Интересное место", "Спокойный вечер", "Свой вариант"],
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
    finishButton: "Всё отлично!"
  },
  labels: {
    back: "Назад",
    customPlaceholder: "Добавить свой вариант",
    selected: "Выбрано",
    empty: "Пока не выбрано"
  },
  effects: {
    confetti: true,
    floatingHearts: true,
    sound: false
  }
};
