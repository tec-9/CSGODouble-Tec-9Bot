var initialBetAmount = 1;
// Начальная ставка
var safety = 1;
// Сигнальный порог
// Сохранность ваших средств: 
//1 = 0-49%   
//2 = 50-74%
//3 = 75-86%

var mode = 'martingale'; 
// установит 'martingale' или 'anti-martingale' ( https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%B3%D0%B5%D0%B9%D0%BB )
//////////////////////////

var betColor = 'spiral'; //
function tick() {
    var a = getStatus();
    if (a !== lastStatus && "unknown" !== a) {
        switch (a) {
            case "waiting":
                bet();
                break;
            case "rolled":
                rolled()
        }
        lastStatus = a, printInfo()
    }
}

//Auto Reconnect
console.log('%cAuto-Reconnect Initialized!', 'color:green');
setInterval(function() {
  if (!WS) {
    console.log('Reconnecting...');
    connect();
  }
}, 5000);

function checkBalance() {
    return currentBetAmount * safety > getBalance() ? (console.warn("БАНКРОТ! НЕХВАТАЕТ СРЕДСТВ ДЛЯ СЛЕДУЮЩЕЙ СТАВКИ"), clearInterval(refreshIntervalId), !1) : !0
}

function printInfo() {
    var a = " \nStatus: " + lastStatus + "\nRolls played: " + currentRollNumber + "\nInitial bet amount: " + initialBetAmount + "\nCurrent bet amount: " + currentBetAmount + "\nLast roll result: " + (null === wonLastRoll() ? "-" : wonLastRoll() ? "won" : "lost");
    console.log(a)
}

function rolled() {
    return "anti-martingale" === mode ? void antiMartingale() : (martingale(), void currentRollNumber++)
}

function antiMartingale() {
    currentBetAmount = wonLastRoll() ? 2 * currentBetAmount : initialBetAmount
}

function martingale() {
    currentBetAmount = wonLastRoll() ? initialBetAmount : 2 * currentBetAmount
}

function bet() {
    checkBalance() && (setBetAmount(currentBetAmount), setTimeout(placeBet, 50))
}

function setBetAmount(a) {
    $betAmountInput.val(a)
}

function placeBet() {
    return "alternately" === lastBetColor ? ($spiralButton.click(), void(lastBetColor = "spiral")) : ($alternatelyButton.click(), void(lastBetColor = "alternately"))
}

function getStatus() {
    var a = $statusBar.text();
    if (hasSubString(a, "Rolling in")) return "waiting";
    if (hasSubString(a, "***ROLLING***")) return "rolling";
    if (hasSubString(a, "rolled")) {
        var b = parseInt(a.split("rolled")[1]);
        return lastRollColor = getColor(b), "rolled"
    }
    return "unknown"
}

function getBalance() {
    return parseInt($balance.text())
}

function hasSubString(a, b) {
    return a.indexOf(b) > -1
}

function getColor(a) {
    return 0 == a ? "green" : a >= 1 && 7 >= a ? "spiral" : "alternately"
}

function wonLastRoll() {
    return lastBetColor ? lastRollColor === lastBetColor : null
}
var currentBetAmount = initialBetAmount,
    currentRollNumber = 1,
    lastStatus, lastBetColor, lastRollColor, $balance = $("#balance"),
    $betAmountInput = $("#betAmount"),
    $statusBar = $(".progress #banner"),
    $spiralButton = $("#panel1-7 .betButton"),
    $alternatelyButton = $("#panel8-14 .betButton"),
    refreshIntervalId = setInterval(tick, 500);
