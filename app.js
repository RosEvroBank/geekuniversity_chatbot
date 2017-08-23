var TelegramBot = require('node-telegram-bot-api');
var apiai = require('apiai');
var uuidv4 = require('uuid/v4');

// Токен нашего бота
const token = '444817888:AAEsr9gQoRnik4D-2Y7us8oM4Z3jMgQ_Nps';

// Токен доступа в api.ai
const apiaiToken = "923134c1e4d54091aba58be1cea53112"
var app = apiai(apiaiToken);
var activeSessions = [];


// Включить опрос сервера
var bot = new TelegramBot(token, { polling: true });

bot.on('message', function(msg) {
    let chatId = msg.chat.id;
    let text = msg.text.toString().trim();

    let sessionId = getActiveSession(chatId);
    if (!sessionId) {
        sessionId = uuidv4();
        addActiveSession(chatId, sessionId);
    }

    makeApiAiRequest(text, sessionId, function(response) {
        console.log('respone', response);
        if (response.status.code === 200) {
            if (!response.result.actionIncomplete) {
                deleteSession(response.sessionId)
            }
            bot.sendMessage(chatId, response.result.fulfillment.speech);
        } else {
            console.error('Ошибка', response.status.errorType);
        }
    });
});

function getActiveSession(chatId) {
    for (var i = 0; i < activeSessions.length; i++) {
        var element = activeSessions[i];
        if (chatId === element.chatId) {
            console.log('element have founded');
            return element.session;
        }
    }
    return "";
}

function addActiveSession(chatId, sessionId) {
    activeSessions.push({
        chatId: chatId,
        session: sessionId
    });
    console.log("New element added");
}

function deleteSession(chatId) {
    for (var i = 0; i < activeSessions.length; i++) {
        var element = activeSessions[i];
        if (chatId === element.chatId) {
            activeSessions.splice(i, 1);
            console.log("Session was removed");
            return;
        }
    }
}


function makeApiAiRequest(text, sessionId, onResultCallback, onErrorCallback) {
    console.log("Make request to api.ai\nSessionId:", sessionId, "\nText:", text);
    let request = app.textRequest(text, {
        sessionId: sessionId
    });

    request.on('response', function(response) {
        console.log("Response receive", sessionId, "text", text);
        onResultCallback(response);
    });

    request.on('error', function(error) {
        if (onErrorCallback) {
            onErrorCallback(error)
            return
        }
        console.log(error);
    });

    request.end();
}