var apiai = require('apiai');
const uuidv4 = require('uuid/v4');

var app = apiai("923134c1e4d54091aba58be1cea53112");
var stdin = process.openStdin();
let currentSession = "";

stdin.addListener("data", function(d) {
    let text = d.toString().trim();
    // console.log("you entered: [" + text + "]");
    if (text === "exit")
        process.exit(0);

    if (currentSession) {
        sessionId = currentSession;
    } else {
        sessionId = uuidv4();
        currentSession = sessionId;
    }

    // console.log('sessionId', sessionId)
    makeRequest(text, sessionId, function(response) {
        // console.log('respone', response);
        if (response.status.code === 200) {
            if (!response.result.actionIncomplete) {
                currentSession = "";
            }
            console.log('Bot:', response.result.fulfillment.speech)
        } else {
            console.error('Ошибка', response.status.errorType);
        }
    });
});

function makeRequest(text, sessionId, onResultCallback, onErrorCallback) {
    let request = app.textRequest(text, {
        sessionId: sessionId
    });

    request.on('response', function(response) {
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