/// <reference path="ts/controller/MainController.ts" />
/// <reference path="ts/controller/ApplicationController.ts" />
/// <reference path="ts/controller/ListController.ts" />
/// <reference path="ts/controller/WordController.ts" />
/// <reference path="ts/Services/DataManager.ts" />
/// <reference path="ts/Services/Transporter.ts" />
/// <reference path="ts/Services/FlashcardService.ts" />


module vocab
{
    "use strict";
    var vocabLearner = angular.module("VocabLearner", [])
        .controller("mainCtrl", MainCtrl)
        .controller("applicationController", ApplicationController)
        .controller("listController", ListController)
        .controller("wordController", WordController)
        .service("dataManager", DataManager)
        .service("transporter", Transporter)
        .service("flashcardService", FlashcardService);
}