var TelegramBot = require('node-telegram-bot-api');

// Токен нашего бота
var token = '444817888:AAEsr9gQoRnik4D-2Y7us8oM4Z3jMgQ_Nps';

// Включить опрос сервера
var bot = new TelegramBot(token, { polling: true });

// '/echo Hello! - пришлет сообщение обратно
bot.onText(/\/sendme (.+)/, function(msg, match) {
    var fromId = msg.from.id;
    console.log('from', fromId);
    var resp = match[1];
    bot.sendMessage(fromId, resp);
});

bot.on('message', function(msg) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello to you");
});