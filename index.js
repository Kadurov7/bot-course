const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "6067343276:AAHH0lBBP1bhZBm6rVddZGIWKWtuTNWjeeQ";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const statGame = async (chatIt) => {
  await bot.sendMessage(
    chatIt,
    `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatIt] = randomNumber;
  await bot.sendMessage(chatIt, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatIt = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatIt,
        "https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/3.webp"
      );
      return bot.sendMessage(
        chatIt,
        `Добро пожаловать в телеграм бот автора Bekzhan`
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatIt,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return statGame(chatIt);
    }
    return bot.sendMessage(chatIt, "Я тебя не понимаю еще раз!");
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatIt = msg.message.chat.id;
    if (data === "/again") {
      return statGame(chatIt);
    }
    if (data === chats[chatIt]) {
      return bot.sendMessage(
        chatIt,
        `Поздравляю, ты отгадад цифру ${chats[chatIt]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatIt,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatIt]}`,
        againOptions
      );
    }
  });
};
start();
