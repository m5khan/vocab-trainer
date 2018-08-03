module vocab {
    //TODO : REMOVE WITH CREDENTIALS CONFIGURATION OBJECT FROM EVERY REQUEST also restore CSP on server
    "use strict";
    export class Transporter {
        baseUri: string = "https://vocabtrainer.herokuapp.com";//"http://localhost:3000";
        loginUri: string = "/login"; 

        public static $inject = [
            '$http'
        ];

        constructor(private $http:ng.IHttpService) {
            console.log("inside transporter constructor");
        }

        login(obj: Ilogin): ng.IHttpPromise<any> {
            return this.$http.post(this.baseUri + this.loginUri, obj/*, { withCredentials: true }*/);
        }

        isLoggedin(): ng.IHttpPromise<any> {
            return this.$http.get(this.baseUri + '/users/isloggedin');
        }

        getListItems(): ng.IHttpPromise<any> {
            return this.$http.get(this.baseUri + "/app/list");
        }

        addList(listName:string): ng.IHttpPromise<any> {
            return this.$http.get(this.baseUri + "/app/list/add?name=" + listName);
        }

        deleteList(listId: string): ng.IHttpPromise<any> {
            return this.$http.get(this.baseUri + "/app/list/drop?listid=" + listId);
        }

        getWords(listId: string): ng.IHttpPromise<any> {
            if (listId == "") {
                return this.$http.get(this.baseUri + "/app/words"); 
            } else
            return this.$http.get(this.baseUri + "/app/words?listid=" + listId); 
        }

        addWord(word: IWordEdit): ng.IHttpPromise<any> {
            var obj = { data: JSON.stringify(word) };
            return this.$http.post(this.baseUri + "/app/words/add", obj);
        }

        updateWord(word: IWord): ng.IHttpPromise<any> {
            var obj = { data: JSON.stringify(word) };
            return this.$http.post(this.baseUri + "/app/words/update", obj);
        }

        deleteWord(wordId:string): ng.IHttpPromise<any> {
            return this.$http.get(this.baseUri + "/app/words/remove?id=" + wordId); 
        }

        addToCarry(wordId: string): ng.IHttpPromise<any> {
            return this.$http.get(this.baseUri + "/app/words/carry?id=" + wordId);
        }

        getCarry(): ng.IHttpPromise<any> {
            return this.$http.get(this.baseUri + "/app/words/carried");
        }

        dropCarryWord(wordId:string): ng.IHttpPromise<any> {
            return this.$http.get(this.baseUri + "/app/words/drop?id=" + wordId);
        }

        clearCarry(): ng.IHttpPromise<any> {
            return this.$http.get(this.baseUri + "/app/words/clearcarry");
        }
    }
} 