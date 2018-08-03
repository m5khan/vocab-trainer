module vocab {
    'use strict';

    export class FlashcardService {
        private wordList: IWord[];
        private tempList: IWord[];

        constructor() {
            console.log("Flash card service constructor");
        }

        initialize(wordList:IWord[]) {
            this.wordList = this.removeMasteredCards(wordList);
            this.tempList = [];
        }

        private removeMasteredCards(wlist:IWord[]):IWord[] {
            var list: IWord[] = [];
            for (var i = 0; i < wlist.length; i++) {
                if (!wlist[i].mastered) {
                    list.push(wlist[i]);
                }
            }
            return list;
        }

        getWord(): IWord {
            if(this.wordList.length <= 0 ) {
                this.wordList = this.tempList;
                this.tempList = [];
            }
            var index: number = this.getrandomVal(this.wordList.length - 1);
            var word: IWord = this.wordList.splice(index, 1)[0];
            this.tempList.push(word);
            return word;
        }

        private getrandomVal(limit: number) {
            return Math.floor(Math.random() * (limit + 1));
        }

        stopFlashCard() {
            this.wordList.length = 0;
            //this.wordList = [];
            this.tempList.length = 0;
        }
    }
}