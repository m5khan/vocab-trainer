///< reference path="ts/interface/IWordCtrlScope.ts"/>
///< reference path="ts/interface/IDataModel.ts/>
module vocab {
    "use strict";
    export class WordController {

        Words: IWord[] = [];
        selectedWord: IWord;
        editWord: IWordEdit;

        wordflags = WordFlags;
        flag: WordFlags; 
        isList: boolean = false; //check either words belong to list or are global
        isCarry: boolean = false;
        cardFlip: boolean = false;

        listName: string;

        public static $inject = [
            '$scope',
            'transporter',
            'dataManager',
            'flashcardService'
        ];
        
        constructor(private $scope: IWordCtrlScope, private transporter: Transporter, private dataManager: DataManager, private flashcardService:FlashcardService) {
            console.log("inside Word Controller constructor");
            $scope.vm = this;
            this.flag = WordFlags.list;

            if (!dataManager.selectedList) {
                //getAllWords
                this.getWords("");
                this.listName = "All Words"
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


        getWords(listId:string) {
            var promise = this.transporter.getWords(listId);
            promise.then((res) => {
                console.log(res, res.data);
                //if (!this.Words) this.Words = [];//initialize
                this.Words = res.data;
            },
                (err) => {
                    console.log(err);
                });
        }

        newWord() {
            this.editWord = null;
            this.flag = WordFlags.add;
        }

        edit_addMeaning(meaning: string) {
            if (!meaning || meaning.trim().length < 1) return;
            if (!this.editWord.meaning)
                this.editWord.meaning = [];
            this.editWord.meaning.push(meaning);
        }

        edit_removeMeaning(index: number) {
            this.editWord.meaning.splice(index, 1);
        }

        edit_addSentence(sentence: string) {
            if (!sentence || sentence.trim().length < 1) return;
            if (!this.editWord.sentence)
                this.editWord.sentence = [];
            this.editWord.sentence.push(sentence);
        }

        edit_removeSentence(index: number) {
            this.editWord.sentence.splice(index, 1);
        }

        edit_discard() {
            this.editWord = null;
            this.flag = WordFlags.list;
        }

        edit_save() {
            //if this.editword.arrid and editword._id then update word else add word
            if (this.editWord._id && this.editWord.arrIndex != undefined) {
                this.updateWord();
            } else
                this.addNewWord();
        }

        private updateWord() {
            console.log("updating word");
            var index = this.editWord.arrIndex;
            var wordObj: IWord = {
                _id: this.editWord._id,
                listid: this.editWord.listid,
                mastered: this.editWord.mastered,
                meaning: this.editWord.meaning,
                sentence: this.editWord.sentence,
                word: this.editWord.word
            };
            var promise: ng.IHttpPromise<any> = this.transporter.updateWord(wordObj);
            promise.success((res) => {
                console.log(res);
                this.Words.splice(index, 1);
                this.Words.push(wordObj);
                this.editWord = null;
                this.flag = WordFlags.list;
            });
            promise.error((err) => {
                console.error(err);
                this.$scope.$emit("showError", "failed to save data, please check your internet connection");
            });
        }

        private addNewWord() {
            var wordObj: IWordEdit = {
                listid: this.dataManager.selectedList._id, 
                word: this.editWord.word,
                meaning: this.editWord.meaning,
                sentence: this.editWord.sentence
            }
            console.log(wordObj);
            var promise = this.transporter.addWord(wordObj);
            promise.then((res) => {
                console.log(res, res.data);
                this.Words.push(res.data[0]);
                this.editWord = null;
                this.flag = WordFlags.list;
            },(err) => {
                    console.error(err);
                    this.$scope.$emit("showError", "failed to save data, please check your internet connection");
                });
        }

        word_remove($index) {
            var id: string = this.Words[$index]._id;
            var promise: ng.IHttpPromise<any> = this.transporter.deleteWord(id);
            promise.then((res) => {
                console.log(res, res.data);
                this.Words.splice($index, 1);
            },(err) => {
                    console.log(err);
            });
        }

        word_edit(word: IWord, $index) {
            var editObj: IWordEdit = {
                _id: word._id,
                arrIndex: $index,
                listid: word.listid,
                mastered: word.mastered,
                meaning: word.meaning,
                sentence: word.sentence,
                word: word.word
            }
            this.editWord = editObj;
            this.flag = WordFlags.edit;
        }

        showWord(word: IWord, index:number) {
            this.flag = WordFlags.detail;
            this.selectedWord = word;
            this.selectedWord.arrIndex = index;
        }

        showList() {
            this.flag = WordFlags.list;
        }

        editSelectedWord() {
            this.editWord = this.selectedWord;
            this.flag = WordFlags.edit;
        }

        startFlashCard() {
            if (this.flag != WordFlags.flashcard) {
                this.flag = WordFlags.flashcard;
                this.flashcardService.initialize(this.Words);
                this.selectedWord = this.flashcardService.getWord();
                this.cardFlip = false; 
            } else return;
        }

        stopFlashCard() {
            this.flag = WordFlags.list;
            this.flashcardService.stopFlashCard();
        }

        nextFlashCard() {
            this.cardFlip = false;
            this.selectedWord = this.flashcardService.getWord();
        }

        flipFlashCard() {
            this.cardFlip ? this.cardFlip = false : this.cardFlip = true;
        }

        addToCarry(word: IWord) {
            var wordId:string = word._id;
            this.transporter.addToCarry(wordId).then((res) => {
                if (res.status == 200) {
                    console.log("word added to carry list");
                }
            },(err) => {
                console.error(err);
            });
        }

        getCarriedWords() {
            this.transporter.getCarry().then((res) => {
                console.log(res.data);
                this.Words = res.data;
            },(err) => {
                console.error(err)
            });
        }


        dropCarryWord(index:number) {
            var id: string = this.Words[index]._id;
            var promise: ng.IHttpPromise<any> = this.transporter.dropCarryWord(id);
            promise.then((res) => {
                console.log(res, res.data);
                this.Words.splice(index, 1);
            },(err) => {
                    console.log(err);
                });
        }
    }
} 