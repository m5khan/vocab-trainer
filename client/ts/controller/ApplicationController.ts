///< reference path="ts/interface/IApplicationControllScope.ts"/>
///< reference path="ts/interface/IDataModel.ts/>


module vocab {
    "use strict";
    export class ApplicationController {

        menu = Menu;
        menuFlag: Menu = Menu.list;
        error: IError = {
            show: false,
            message : ""
        }

        public static $inject = [
            '$scope',
            '$timeout',
            'dataManager'
        ];

        constructor(private $scope: IApplicationControlScope, private $timeout:ng.ITimeoutService, private dataManager:DataManager) {
            console.log("inside Application Controller constructor");
            $scope.vm = this;
            this.menuFlag = Menu.list;

            $scope.$on("openWord", (event: ng.IAngularEvent) => {
                event.stopPropagation();
                this.menuFlag = Menu.words;
            });

            //$scope.$on("openList",(event: ng.IAngularEvent) => {
            //    event.stopPropagation();
            //    this.listClick();
            //});

            $scope.$on("showError",(evt: ng.IAngularEvent, message: string) => {
                evt.stopPropagation();
                this.error.show = true;
                this.error.message = message;
                $timeout(() => {
                    this.error.show = false;
                    this.error.message = "";
                }, 5000);
            });
        }

        listClick() {
            this.menuFlag = Menu.list;
        }

        wordClick() {
            if(this.menuFlag != Menu.words) // word is not selected already
                this.dataManager.selectedList = null;  //selectedlist set to empty will show all words
            this.menuFlag = Menu.words;
        }

    }
} 