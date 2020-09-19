// ==UserScript==
// @name forMainPage1xbet
// @description Opens basketball page
// @author YourTinyFenrir
// @license MIT
// @version 1.0
// @include https://1x-bet*.com/ru/
// ==/UserScript==

function isReady(expressionFunction, completionFunction) {
   console.log("isReady(" + expressionFunction + ", " + completionFunction + ");");
   if (expressionFunction())
       completionFunction();
   else
       setTimeout(() => { isReady(expressionFunction, completionFunction); }, 50);
}

isReady(() => document.getElementsByClassName("link")[0] != undefined, () => {

    let str = window.location.href;
    let openWindow = window.open(str + "line/Basketball/");
    isReady(() => openWindow.closed, () => { window.close(); } );

    // variables for script "forBasketballPage1xbet"
    localStorage.setItem("currentLeague", 0);
    localStorage.setItem("currentMatch", 0);
    localStorage.setItem("currentSubgame", -1);
    localStorage.setItem("numOfSubgame", 0);
    localStorage.setItem("state", 0); // 0 - OpenLeagueWindow, 1 - openMatchWindow, 2 - collectData
    localStorage.setItem("date", 0);
    localStorage.setItem("name", 0);

    localStorage.setItem("match", 0);
    localStorage.setItem("listOfMatches", 0);

});
