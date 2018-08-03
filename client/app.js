///< reference path="ts/interface/IMainCtrlScope.ts"/>
///< reference path="ts/interface/IDataModel.ts/>
var vocab;
(function (vocab) {
    "use strict";
    var MainCtrl = (function () {
        function MainCtrl($scope, transporter) {
            this.$scope = $scope;
            this.transporter = transporter;
            this.homeSwitch = false;
            this.signinSwitch = false;
            this.mainView = "main";
            console.log("inside mainCtrl");
            $scope.vm = this;
            this.loginSession();
        }
        MainCtrl.prototype.homeClick = function () {
            this.homeSwitch = true;
            this.signinSwitch = false;
        };
        MainCtrl.prototype.signinClick = function () {
            this.homeSwitch = false;
            this.signinSwitch = true;
        };
        MainCtrl.prototype.loginHandler = function () {
            this.mainView = "app";
        };
        MainCtrl.prototype.loginClick = function (user) {
            var _this = this;
            var promise = this.transporter.login(user);
            promise.then(function (data) {
                console.log("login successful", data);
                _this.loginHandler();
            }, function (err) {
                console.log("login failed", err);
                alert("login failed");
            });
        };
        /*
        * checks if user is logged in and redirect him to main app without login process
        */
        MainCtrl.prototype.loginSession = function () {
            var _this = this;
            this.transporter.isLoggedin().then(function (res) {
                console.log(res);
                if (res.status == 200) {
                    _this.loginHandler();
                }
                else {
                    _this.homeSwitch = true;
                }
            }, function (err) {
                console.error(err);
                _this.homeSwitch = true;
            });
        };
        MainCtrl.$inject = [
            '$scope',
            'transporter'
        ];
        return MainCtrl;
    })();
    vocab.MainCtrl = MainCtrl;
})(vocab || (vocab = {}));
///< reference path="ts/interface/IApplicationControllScope.ts"/>
///< reference path="ts/interface/IDataModel.ts/>
var vocab;
(function (vocab) {
    "use strict";
    var ApplicationController = (function () {
        function ApplicationController($scope, $timeout, dataManager) {
            var _this = this;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.dataManager = dataManager;
            this.menu = vocab.Menu;
            this.menuFlag = 1 /* list */;
            this.error = {
                show: false,
                message: ""
            };
            console.log("inside Application Controller constructor");
            $scope.vm = this;
            this.menuFlag = 1 /* list */;
            $scope.$on("openWord", function (event) {
                event.stopPropagation();
                _this.menuFlag = 2 /* words */;
            });
            //$scope.$on("openList",(event: ng.IAngularEvent) => {
            //    event.stopPropagation();
            //    this.listClick();
            //});
            $scope.$on("showError", function (evt, message) {
                evt.stopPropagation();
                _this.error.show = true;
                _this.error.message = message;
                $timeout(function () {
                    _this.error.show = false;
                    _this.error.message = "";
                }, 5000);
            });
        }
        ApplicationController.prototype.listClick = function () {
            this.menuFlag = 1 /* list */;
        };
        ApplicationController.prototype.wordClick = function () {
            if (this.menuFlag != 2 /* words */)
                this.dataManager.selectedList = null; //selectedlist set to empty will show all words
            this.menuFlag = 2 /* words */;
        };
        ApplicationController.$inject = [
            '$scope',
            '$timeout',
            'dataManager'
        ];
        return ApplicationController;
    })();
    vocab.ApplicationController = ApplicationController;
})(vocab || (vocab = {}));
///< reference path="ts/interface/IListCtrlScope.ts"/>
///< reference path="ts/interface/IDataModel.ts/>
var vocab;
(function (vocab) {
    "use strict";
    var ListController = (function () {
        function ListController($scope, transporter, dataManager) {
            this.$scope = $scope;
            this.transporter = transporter;
            this.dataManager = dataManager;
            this.remove = {
                alert: false,
                index: null
            };
            console.log("inside list Controller constructor");
            $scope.vm = this;
            this.getListItems();
        }
        ListController.prototype.getListItems = function () {
            var _this = this;
            if (!this.dataManager.list || !this.dataManager.list.length || this.dataManager.list.length == 0) {
                var promise = this.transporter.getListItems();
                promise.then(function (res) {
                    console.log(res);
                    _this.list = _this.dataManager.list = res.data;
                    //this.dataManager.list = res.data;
                }, function (err) {
                    console.log(err);
                });
            }
            else {
                this.list = this.dataManager.list; //restore cache data
                console.log("cached data restored");
            }
        };
        ListController.prototype.addListItem = function (listInput) {
            var _this = this;
            var promise = this.transporter.addList(listInput);
            promise.then(function (res) {
                console.log(res, res.data);
                var listObj = {
                    _id: res.data._id,
                    name: res.data.name
                };
                _this.list.push(listObj);
            }, function (err) {
                console.log(err);
            });
        };
        ListController.prototype.removeListWarning = function (index) {
            this.remove.alert = true;
            this.remove.index = index;
        };
        ListController.prototype.removeConfirm = function () {
            this.removeListItem(this.remove.index);
            this.removeCancel();
        };
        ListController.prototype.removeCancel = function () {
            this.remove.alert = false;
            this.remove.index = null;
        };
        ListController.prototype.removeListItem = function (index) {
            var _this = this;
            var listItem = this.list[index];
            var promise = this.transporter.deleteList(listItem._id);
            promise.then(function (res) {
                console.log(res, res.data);
                _this.list.splice(index, 1);
            }, function (err) {
                console.log(err);
            });
        };
        ListController.prototype.selectListItem = function (index) {
            this.dataManager.selectedList = {
                _id: this.list[index]._id,
                name: this.list[index].name
            };
            this.openWordsTab();
        };
        ListController.prototype.openWordsTab = function () {
            this.$scope.$emit("openWord");
        };
        ListController.prototype.selectCarryList = function () {
            this.dataManager.selectedList = {
                _id: "carry",
                name: "carry"
            };
            this.openWordsTab();
        };
        ListController.prototype.clearCarry = function () {
            this.transporter.clearCarry().then(function (res) {
                if (res.status == 200) {
                    console.log("carry cleared");
                }
            }, function (err) {
                console.error(err);
            });
        };
        ListController.$inject = [
            '$scope',
            'transporter',
            'dataManager'
        ];
        return ListController;
    })();
    vocab.ListController = ListController;
})(vocab || (vocab = {}));
///< reference path="ts/interface/IWordCtrlScope.ts"/>
///< reference path="ts/interface/IDataModel.ts/>
var vocab;
(function (vocab) {
    "use strict";
    var WordController = (function () {
        function WordController($scope, transporter, dataManager, flashcardService) {
            this.$scope = $scope;
            this.transporter = transporter;
            this.dataManager = dataManager;
            this.flashcardService = flashcardService;
            this.Words = [];
            this.wordflags = vocab.WordFlags;
            this.isList = false; //check either words belong to list or are global
            this.isCarry = false;
            this.cardFlip = false;
            console.log("inside Word Controller constructor");
            $scope.vm = this;
            this.flag = 1 /* list */;
            if (!dataManager.selectedList) {
                //getAllWords
                this.getWords("");
                this.listName = "All Words";
            }
            else if (dataManager.selectedList._id == "carry" && dataManager.selectedList.name == "carry") {
                //get carry words
                this.getCarriedWords();
                this.isCarry = true;
                this.listName = "Carry Words";
            }
            else {
                //getWords of selected list
                this.getWords(dataManager.selectedList._id);
                this.isList = true;
                this.listName = dataManager.selectedList.name;
            }
        }
        WordController.prototype.getWords = function (listId) {
            var _this = this;
            var promise = this.transporter.getWords(listId);
            promise.then(function (res) {
                console.log(res, res.data);
                //if (!this.Words) this.Words = [];//initialize
                _this.Words = res.data;
            }, function (err) {
                console.log(err);
            });
        };
        WordController.prototype.newWord = function () {
            this.editWord = null;
            this.flag = 3 /* add */;
        };
        WordController.prototype.edit_addMeaning = function (meaning) {
            if (!meaning || meaning.trim().length < 1)
                return;
            if (!this.editWord.meaning)
                this.editWord.meaning = [];
            this.editWord.meaning.push(meaning);
        };
        WordController.prototype.edit_removeMeaning = function (index) {
            this.editWord.meaning.splice(index, 1);
        };
        WordController.prototype.edit_addSentence = function (sentence) {
            if (!sentence || sentence.trim().length < 1)
                return;
            if (!this.editWord.sentence)
                this.editWord.sentence = [];
            this.editWord.sentence.push(sentence);
        };
        WordController.prototype.edit_removeSentence = function (index) {
            this.editWord.sentence.splice(index, 1);
        };
        WordController.prototype.edit_discard = function () {
            this.editWord = null;
            this.flag = 1 /* list */;
        };
        WordController.prototype.edit_save = function () {
            //if this.editword.arrid and editword._id then update word else add word
            if (this.editWord._id && this.editWord.arrIndex != undefined) {
                this.updateWord();
            }
            else
                this.addNewWord();
        };
        WordController.prototype.updateWord = function () {
            var _this = this;
            console.log("updating word");
            var index = this.editWord.arrIndex;
            var wordObj = {
                _id: this.editWord._id,
                listid: this.editWord.listid,
                mastered: this.editWord.mastered,
                meaning: this.editWord.meaning,
                sentence: this.editWord.sentence,
                word: this.editWord.word
            };
            var promise = this.transporter.updateWord(wordObj);
            promise.success(function (res) {
                console.log(res);
                _this.Words.splice(index, 1);
                _this.Words.push(wordObj);
                _this.editWord = null;
                _this.flag = 1 /* list */;
            });
            promise.error(function (err) {
                console.error(err);
                _this.$scope.$emit("showError", "failed to save data, please check your internet connection");
            });
        };
        WordController.prototype.addNewWord = function () {
            var _this = this;
            var wordObj = {
                listid: this.dataManager.selectedList._id,
                word: this.editWord.word,
                meaning: this.editWord.meaning,
                sentence: this.editWord.sentence
            };
            console.log(wordObj);
            var promise = this.transporter.addWord(wordObj);
            promise.then(function (res) {
                console.log(res, res.data);
                _this.Words.push(res.data[0]);
                _this.editWord = null;
                _this.flag = 1 /* list */;
            }, function (err) {
                console.error(err);
                _this.$scope.$emit("showError", "failed to save data, please check your internet connection");
            });
        };
        WordController.prototype.word_remove = function ($index) {
            var _this = this;
            var id = this.Words[$index]._id;
            var promise = this.transporter.deleteWord(id);
            promise.then(function (res) {
                console.log(res, res.data);
                _this.Words.splice($index, 1);
            }, function (err) {
                console.log(err);
            });
        };
        WordController.prototype.word_edit = function (word, $index) {
            var editObj = {
                _id: word._id,
                arrIndex: $index,
                listid: word.listid,
                mastered: word.mastered,
                meaning: word.meaning,
                sentence: word.sentence,
                word: word.word
            };
            this.editWord = editObj;
            this.flag = 2 /* edit */;
        };
        WordController.prototype.showWord = function (word, index) {
            this.flag = 4 /* detail */;
            this.selectedWord = word;
            this.selectedWord.arrIndex = index;
        };
        WordController.prototype.showList = function () {
            this.flag = 1 /* list */;
        };
        WordController.prototype.editSelectedWord = function () {
            this.editWord = this.selectedWord;
            this.flag = 2 /* edit */;
        };
        WordController.prototype.startFlashCard = function () {
            if (this.flag != 5 /* flashcard */) {
                this.flag = 5 /* flashcard */;
                this.flashcardService.initialize(this.Words);
                this.selectedWord = this.flashcardService.getWord();
                this.cardFlip = false;
            }
            else
                return;
        };
        WordController.prototype.stopFlashCard = function () {
            this.flag = 1 /* list */;
            this.flashcardService.stopFlashCard();
        };
        WordController.prototype.nextFlashCard = function () {
            this.cardFlip = false;
            this.selectedWord = this.flashcardService.getWord();
        };
        WordController.prototype.flipFlashCard = function () {
            this.cardFlip ? this.cardFlip = false : this.cardFlip = true;
        };
        WordController.prototype.addToCarry = function (word) {
            var wordId = word._id;
            this.transporter.addToCarry(wordId).then(function (res) {
                if (res.status == 200) {
                    console.log("word added to carry list");
                }
            }, function (err) {
                console.error(err);
            });
        };
        WordController.prototype.getCarriedWords = function () {
            var _this = this;
            this.transporter.getCarry().then(function (res) {
                console.log(res.data);
                _this.Words = res.data;
            }, function (err) {
                console.error(err);
            });
        };
        WordController.prototype.dropCarryWord = function (index) {
            var _this = this;
            var id = this.Words[index]._id;
            var promise = this.transporter.dropCarryWord(id);
            promise.then(function (res) {
                console.log(res, res.data);
                _this.Words.splice(index, 1);
            }, function (err) {
                console.log(err);
            });
        };
        WordController.$inject = [
            '$scope',
            'transporter',
            'dataManager',
            'flashcardService'
        ];
        return WordController;
    })();
    vocab.WordController = WordController;
})(vocab || (vocab = {}));
var vocab;
(function (vocab) {
    'use strict';
    var DataManager = (function () {
        function DataManager() {
            console.log("inside DataManager constructor");
        }
        Object.defineProperty(DataManager.prototype, "selectedList", {
            get: function () {
                return this._selectedList;
            },
            set: function (listObj) {
                this._selectedList = listObj;
            },
            enumerable: true,
            configurable: true
        });
        return DataManager;
    })();
    vocab.DataManager = DataManager;
})(vocab || (vocab = {}));
var vocab;
(function (vocab) {
    //TODO : REMOVE WITH CREDENTIALS CONFIGURATION OBJECT FROM EVERY REQUEST also restore CSP on server
    "use strict";
    var Transporter = (function () {
        function Transporter($http) {
            this.$http = $http;
            this.baseUri =   "https://vocabtrainer.herokuapp.com";//"http://localhost:3000";
            this.loginUri = "/login";
            console.log("inside transporter constructor");
        }
        Transporter.prototype.login = function (obj) {
            return this.$http.post(this.baseUri + this.loginUri, obj);
        };
        Transporter.prototype.isLoggedin = function () {
            return this.$http.get(this.baseUri + '/users/isloggedin');
        };
        Transporter.prototype.getListItems = function () {
            return this.$http.get(this.baseUri + "/app/list");
        };
        Transporter.prototype.addList = function (listName) {
            return this.$http.get(this.baseUri + "/app/list/add?name=" + listName);
        };
        Transporter.prototype.deleteList = function (listId) {
            return this.$http.get(this.baseUri + "/app/list/drop?listid=" + listId);
        };
        Transporter.prototype.getWords = function (listId) {
            if (listId == "") {
                return this.$http.get(this.baseUri + "/app/words");
            }
            else
                return this.$http.get(this.baseUri + "/app/words?listid=" + listId);
        };
        Transporter.prototype.addWord = function (word) {
            var obj = { data: JSON.stringify(word) };
            return this.$http.post(this.baseUri + "/app/words/add", obj);
        };
        Transporter.prototype.updateWord = function (word) {
            var obj = { data: JSON.stringify(word) };
            return this.$http.post(this.baseUri + "/app/words/update", obj);
        };
        Transporter.prototype.deleteWord = function (wordId) {
            return this.$http.get(this.baseUri + "/app/words/remove?id=" + wordId);
        };
        Transporter.prototype.addToCarry = function (wordId) {
            return this.$http.get(this.baseUri + "/app/words/carry?id=" + wordId);
        };
        Transporter.prototype.getCarry = function () {
            return this.$http.get(this.baseUri + "/app/words/carried");
        };
        Transporter.prototype.dropCarryWord = function (wordId) {
            return this.$http.get(this.baseUri + "/app/words/drop?id=" + wordId);
        };
        Transporter.prototype.clearCarry = function () {
            return this.$http.get(this.baseUri + "/app/words/clearcarry");
        };
        Transporter.$inject = [
            '$http'
        ];
        return Transporter;
    })();
    vocab.Transporter = Transporter;
})(vocab || (vocab = {}));
var vocab;
(function (vocab) {
    'use strict';
    var FlashcardService = (function () {
        function FlashcardService() {
            console.log("Flash card service constructor");
        }
        FlashcardService.prototype.initialize = function (wordList) {
            this.wordList = this.removeMasteredCards(wordList);
            this.tempList = [];
        };
        FlashcardService.prototype.removeMasteredCards = function (wlist) {
            var list = [];
            for (var i = 0; i < wlist.length; i++) {
                if (!wlist[i].mastered) {
                    list.push(wlist[i]);
                }
            }
            return list;
        };
        FlashcardService.prototype.getWord = function () {
            if (this.wordList.length <= 0) {
                this.wordList = this.tempList;
                this.tempList = [];
            }
            var index = this.getrandomVal(this.wordList.length - 1);
            var word = this.wordList.splice(index, 1)[0];
            this.tempList.push(word);
            return word;
        };
        FlashcardService.prototype.getrandomVal = function (limit) {
            return Math.floor(Math.random() * (limit + 1));
        };
        FlashcardService.prototype.stopFlashCard = function () {
            this.wordList.length = 0;
            //this.wordList = [];
            this.tempList.length = 0;
        };
        return FlashcardService;
    })();
    vocab.FlashcardService = FlashcardService;
})(vocab || (vocab = {}));
/// <reference path="ts/controller/MainController.ts" />
/// <reference path="ts/controller/ApplicationController.ts" />
/// <reference path="ts/controller/ListController.ts" />
/// <reference path="ts/controller/WordController.ts" />
/// <reference path="ts/Services/DataManager.ts" />
/// <reference path="ts/Services/Transporter.ts" />
/// <reference path="ts/Services/FlashcardService.ts" />
var vocab;
(function (vocab) {
    "use strict";
    var vocabLearner = angular.module("VocabLearner", []).controller("mainCtrl", vocab.MainCtrl).controller("applicationController", vocab.ApplicationController).controller("listController", vocab.ListController).controller("wordController", vocab.WordController).service("dataManager", vocab.DataManager).service("transporter", vocab.Transporter).service("flashcardService", vocab.FlashcardService);
})(vocab || (vocab = {}));
var vocab;
(function (vocab) {
    'use strict';
})(vocab || (vocab = {}));
var vocab;
(function (vocab) {
    "use strict";
    (function (Menu) {
        Menu[Menu["list"] = 1] = "list";
        Menu[Menu["words"] = 2] = "words";
    })(vocab.Menu || (vocab.Menu = {}));
    var Menu = vocab.Menu;
    (function (WordFlags) {
        WordFlags[WordFlags["list"] = 1] = "list";
        WordFlags[WordFlags["edit"] = 2] = "edit";
        WordFlags[WordFlags["add"] = 3] = "add";
        WordFlags[WordFlags["detail"] = 4] = "detail";
        WordFlags[WordFlags["flashcard"] = 5] = "flashcard";
    })(vocab.WordFlags || (vocab.WordFlags = {}));
    var WordFlags = vocab.WordFlags;
})(vocab || (vocab = {}));
var vocab;
(function (vocab) {
    'use strict';
})(vocab || (vocab = {}));
var vocab;
(function (vocab) {
    'use strict';
})(vocab || (vocab = {}));
var vocab;
(function (vocab) {
    'use strict';
})(vocab || (vocab = {}));
//# sourceMappingURL=app.js.map