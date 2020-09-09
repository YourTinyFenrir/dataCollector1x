// ==UserScript==
// @name forMainPage1xbet
// @description Opens basketball page
// @author YourTinyFenrir
// @license MIT
// @version 1.0
// @include https://bet-1x*.com/ru/
// ==/UserScript==

function isReady(expressionFunction, completionFunction) {
   console.log("isReady(" + expressionFunction + ", " + completionFunction + ");");
   if (expressionFunction())
       completionFunction();
   else
       setTimeout(() => { isReady(expressionFunction, completionFunction); }, 50);
}

isReady(() => document.getElementsByClassName("link")[0] != undefined, () => {

    let isEnd = false;
    for (let i = 0; !isEnd; ++i) {
        console.log(i + " - " + document.getElementsByClassName("link")[i].children[1].innerText);
        if (document.getElementsByClassName("link")[i].children[1].innerText == "Баскетбол") {
            let str = document.getElementsByClassName("link")[i].href;
            window.open(str);
            console.log("Basketball page is opened");
            isEnd = true;
        }
    }

    // variables for script "forBasketballPage1xbet"
    localStorage.setItem("currentLeague", 0);
    localStorage.setItem("currentMatch", 0);
    localStorage.setItem("currentSubgame", -1);
    localStorage.setItem("numOfSubgame", 0);
    localStorage.setItem("state", 0); // 0 - OpenLeagueWindow, 1 - openMatchWindow, 2 - collectData
    localStorage.setItem("date", 0);
    localStorage.setItem("name", 0);

});
