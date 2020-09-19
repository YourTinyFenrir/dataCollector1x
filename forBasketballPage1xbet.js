// ==UserScript==
// @name forBasketballPage1xbet
// @description Opens basketball league/match pages, save data about basketball odds
// @author YourTinyFenrir
// @license MIT
// @version 0.1
// @include https://1x-bet*.com/ru/line/Basketball/*
// ==/UserScript==

function isReady(expressionFunction, completionFunction) {
   console.log("isReady(" + expressionFunction + ", " + completionFunction + ");");
   if (expressionFunction())
       completionFunction();
   else
       setTimeout(() => { isReady(expressionFunction, completionFunction); }, 50);
}

function collectData() {

    isReady(() => document.getElementsByClassName("bet_group")[0] != undefined, () => {
        isReady(() => document.getElementsByClassName("subgames") != undefined, () => {

            let curSubgame = parseInt(localStorage.getItem("currentSubgame"), 10);
            let numOfSubgame = parseInt(localStorage.getItem("numOfSubgame"), 10);

            let match = JSON.parse(localStorage.getItem("match"));
            let listOfMatches = JSON.parse(localStorage.getItem("listOfMatches"));

            let str = 0;
            let re = 0;
            let found = 0;
            let openWindow = 0;

            if (curSubgame == -1) {

                match = {
                    date: localStorage.getItem("date"),
                    name: localStorage.getItem("name"),
                    bets: new Array(),
                };

                if (document.getElementsByClassName("subgames").length > 0) {
                    isReady(() => document.getElementsByClassName("subgames")[0].children != undefined, () => {
                        numOfSubgame = document.getElementsByClassName("subgames")[0].children.length;
                        localStorage.setItem("numOfSubgame", numOfSubgame);
                    });
                }

                console.log("Subgame " + curSubgame + "/" + numOfSubgame);

                let numOfBets = document.getElementsByClassName("bet_group").length;
                for (let i = 0; i < numOfBets; ++i) {
                    isReady(() => document.getElementsByClassName("bet_group")[i].children != undefined, () => {
                        str = document.getElementsByClassName("bet_group")[i].children[0].innerText;
                        re = /Индивидуальный тотал .-го. с ОТ/;
                        found = str.match(re);
                        if (str == "Победа в матче. с ОТ" || found != null) {
                            let bet = {
                                betName: document.getElementsByClassName("bet_group")[i].children[0].innerText,
                                koefs: document.getElementsByClassName("bet_group")[i].children[1].innerText,
                            };
                            match.bets.push(bet);
                        }
                    });
                }
                if (document.getElementsByClassName("subgames").length > 0) {
                    curSubgame++;
                    localStorage.setItem("currentSubgame", curSubgame);
                    localStorage.setItem("match", JSON.stringify(match));
                    str = document.getElementsByClassName("subgames")[0].children[curSubgame].children[1].href;
                    openWindow = window.open(str);
                    isReady(() => openWindow.closed, () => { window.close(); } );
                }
                else {
                    localStorage.setItem("state", 1);
                    localStorage.setItem("currentSubgame", -1);
                    listOfMatches.push(match);
                    localStorage.setItem("match", 0);
                    localStorage.setItem("state", 1);
                    window.close();
                }
            }
            else {

                console.log("Subgame " + curSubgame + "/" + numOfSubgame);

                isReady(() => document.getElementsByClassName("subgames")[0].children[curSubgame] != undefined, () => {
                    str = document.getElementsByClassName("subgames")[0].children[curSubgame].children[1].innerText;
                    re = /.-я Четверть/;
                    found = str.match(re);
                    if (found != null) {
                        let numOfBets = document.getElementsByClassName("bet_group").length;
                        for (let i = 0; i < numOfBets; ++i) {
                             isReady(() => document.getElementsByClassName("bet_group")[i].children != undefined, () => {
                                 str = document.getElementsByClassName("bet_group")[i].children[0].innerText;
                                 re = /Индивидуальный тотал .-го.*/;
                                 found = str.match(re);
                                 let re2 = /1X2.*/;
                                 let found2 = str.match(re2);
                                 if (found != null || found2 != null) {
                                     let bet = {
                                         betName: document.getElementsByClassName("bet_group")[i].children[0].innerText,
                                         koefs: document.getElementsByClassName("bet_group")[i].children[1].innerText,
                                     };
                                     match.bets.push(bet);
                                 }
                             });
                         }
                    }
                    if (curSubgame < numOfSubgame - 1 && curSubgame < 3) {
                        curSubgame++;
                        localStorage.setItem("currentSubgame", curSubgame);
                        localStorage.setItem("match", JSON.stringify(match));
                        str = document.getElementsByClassName("subgames")[0].children[curSubgame].children[1].href;
                        openWindow = window.open(str);
                        isReady(() => openWindow.closed, () => { window.close(); } );
                    }
                    else {
                        localStorage.setItem("state", 1);
                        localStorage.setItem("currentSubgame", -1);
                        if (listOfMatches == "0")
                            listOfMatches = new Array();
                        listOfMatches.push(match);
                        localStorage.setItem("match", 0);
                        localStorage.setItem("listOfMatches", JSON.stringify(listOfMatches));
                        window.close();
                    }
                });
            }
        });
    });
}

function openMatchWindow() {

    isReady(() => document.getElementsByClassName("event_menu")[0] != undefined, () => {
        let numOfMatches = document.getElementsByClassName("event_menu")[0].children.length;
        let curMatch = parseInt(localStorage.getItem("currentMatch"), 10);

        console.log("Match " + curMatch + "/" + numOfMatches);

        if (curMatch < numOfMatches) {
            let strWindow = document.getElementsByClassName("event_menu")[0].children[curMatch].children[0].href;
            let strDate = document.getElementsByClassName("event_menu")[0].children[curMatch].children[0].children[2].innerText;
            let strName = document.getElementsByClassName("event_menu")[0].children[curMatch].children[0].children[0].innerText;
            localStorage.setItem("date", strDate);
            localStorage.setItem("name", strName);
            localStorage.setItem("state", 2);
            let openWindow = window.open(strWindow);
            curMatch++;
            localStorage.setItem("currentMatch", curMatch);
            isReady(() => openWindow.closed, () => { openMatchWindow(curMatch, numOfMatches); } );
        }
        else {
            localStorage.setItem("currentMatch", 0);
            localStorage.setItem("state", 0);
            window.close();
        }
    });

}

function openLeagueWindow() {

    isReady(() => document.getElementsByClassName("link link--labled")[0] != undefined, () => {
        let numOfLeagues = document.getElementsByClassName("link link--labled").length;
        let curLeague = parseInt(localStorage.getItem("currentLeague"), 10);

        console.log("League " + curLeague + "/" + numOfLeagues);

        if (curLeague < numOfLeagues) {
            let str = document.getElementsByClassName("link link--labled")[curLeague].href;
            localStorage.setItem("state", 1);
            let openWindow = window.open(str);
            curLeague++;
            localStorage.setItem("currentLeague", curLeague);
            isReady(() => openWindow.closed, () => { openLeagueWindow(curLeague, numOfLeagues); } );
        }
        else {
            let listOfMatches = JSON.parse(localStorage.getItem("listOfMatches"));
            let a = document.createElement("a");
            let file = new Blob([JSON.stringify(listOfMatches, null, "\t")], { type: "text/plain" });
            a.href = URL.createObjectURL(file);
            a.download = "1x.txt";
            a.click();
        }
    });

}

let st = localStorage.getItem("state");
let listOfMatches = new Array();

if (st == '0') {
    openLeagueWindow();
}
else if (st == '1') {
    openMatchWindow();
}
else {
    collectData();
}
