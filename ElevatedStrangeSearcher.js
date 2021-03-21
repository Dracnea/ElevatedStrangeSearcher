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
    if(sessionStorage.startCheck == 1){
        searcher();
    } else {
        gui();
    }
})();
