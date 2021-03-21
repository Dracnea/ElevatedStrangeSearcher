// ==UserScript==
// @name            TF2 Premium Search Elevated Stranges
// @version         1.0
// @description     A script used to make premium searching for elevated quality stranges on backpack.tf easier
// @author          Dracnea
// @match           https://backpack.tf/premium*
// @grant           none
// ==/UserScript==

'use strict';
//used to start the script
(function () {
    if(sessionStorage.strangeStart == 1){
        searcher();
    } else {
        gui();
    }
})();

//Adds the GUI button to start search, mimics website format
function gui(){
    var btn = document.createElement("button");
    btn.className = 'btn btn-premium btn-block btn-lg';
    btn.innerHTML = "Strange Searcher";
    btn.onclick = function() {
        searcher();
    };
    document.getElementsByClassName('premium-search-form')[0].appendChild(btn);
}

function searcher(){
    //constants for item attributes
    const id = "data-original_id",
          name = "data-name",
          q1 = "data-q_name",
          q2 = "data-qe_name",
          effect = "data-effect_name"
    ;
    class Item {
        constructor(name, q1, q2, effect, history) {
            this.name = name;
            this.q1 = q1;
            this.q2 = q2;
            this.effect = effect;
            this.history = history;
        }
        toJSON(){
            return {
                name: this.name,
                q1: this.q1,
                q2: this.q2,
                effect: this.effect,
                history: this.history

            }
        }
    }
    sessionStorage.strangeStart = 1;
    //set the path for which screen element is considered the rows
    var rows = document.querySelectorAll("li.item");
    //may need new query for all history links
    var links = document.querySelectorAll("a.btn.btn-default.btn-xs");

    rows.forEach(addItem);
    function addItem(item, i){
        if (rows[i].hasAttribute(q2)) {
            var history = links[i*2 + 1].href;
            const myItem = new Item(
                rows[i].getAttribute(name),
                rows[i].getAttribute(q1),
                rows[i].getAttribute(q2),
                rows[i].getAttribute(effect),
                history
            )
            // JSON stringify the object and pass it as a session storage item based on id
            sessionStorage.setItem(rows[i].getAttribute(id), JSON.stringify(myItem));
        }
    }
    skip();
}

function skip(){
    var pageLink = document.evaluate(
        "/html/body/main/div/div/nav/ul/li/a",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    //if no spell is on this page then redirect to next page, extra check to ensure not first page
    if(window.location.href != pageLink.snapshotItem(2).href && window.location.href.indexOf("page=") > -1){
        window.location.replace(pageLink.snapshotItem(1).href);
    }
    //if we have completed the search then print and sanitize
    if(window.location.href == pageLink.snapshotItem(2).href){
        printOut();
    }
}

//Print out all data onto a new tab
function printOut(){
    //create new window document
    var myWindow = window.open('','','');
    //loop through session storage
    for (var i = 0; i < sessionStorage.length; i++){
        //get session obj
        var obj = sessionStorage.getItem(sessionStorage.key(i))
        //ensure the obj is not the startCheck
        if(obj == sessionStorage.getItem("strangeStart")){
            continue;
        }
           //json parse object back into an item class
           var item = JSON.parse(obj)
           //format the item into text
           var text = `${item.name}, ${item.q1}, ${item.q2}, ${item.effect}, <a href=${item.history}>History</a><br>`;
           //clean output
           text = text.replace(new RegExp('null', 'g'), "NULL");
           //write next item as text to document
           myWindow.document.write(text);
    }
    //close and focus the document
    myWindow.document.close();
    myWindow.focus();
    sanitize();
}

function sanitize() {
    sessionStorage.clear();
    location.reload();
}
