///< reference path="ts/interface/IListCtrlScope.ts"/>
///< reference path="ts/interface/IDataModel.ts/>

module vocab {
    "use strict"
    export class ListController {

        list: IList[];
        remove: any = {
            alert: false,
            index: null
        }

        public static $inject = [
            '$scope',
            'transporter',
            'dataManager'
        ];

        constructor(private $scope: IListCtrlScope, private transporter: Transporter, private dataManager: DataManager) {
            console.log("inside list Controller constructor");
            $scope.vm = this;
            this.getListItems();
        }

        getListItems() {  //to remove caching listdata, remove if else statement
            if (!this.dataManager.list || !this.dataManager.list.length || this.dataManager.list.length == 0) {
                var promise = this.transporter.getListItems();
                promise.then((res) => {
                    console.log(res);
                    this.list = this.dataManager.list = res.data;
                    //this.dataManager.list = res.data;
                },
                    (err) => {
                        console.log(err);
                    });
            } else {
                this.list = this.dataManager.list; //restore cache data
                console.log("cached data restored"); 
            }
            
        }

        addListItem(listInput: string) {
            var promise = this.transporter.addList(listInput);
            promise.then((res) => {
                console.log(res, res.data);
                var listObj: IList = {
                    _id: res.data._id,
                    name: res.data.name
                };
                this.list.push(listObj);
            },
                (err) => {
                    console.log(err);
                });
        }

        removeListWarning(index: number) {
            this.remove.alert = true;
            this.remove.index = index;
        }

        removeConfirm() {
            this.removeListItem(this.remove.index);
            this.removeCancel();
        }

        removeCancel() {
            this.remove.alert = false;
            this.remove.index = null;
        }

        private removeListItem(index: number) {
            var listItem = this.list[index];
            var promise = this.transporter.deleteList(listItem._id);
            promise.then((res) => {
                console.log(res, res.data);
                this.list.splice(index, 1);
            },
                (err) => {
                    console.log(err);
                });
        }

        selectListItem(index: number) {
            this.dataManager.selectedList = {
                _id: this.list[index]._id,
                name: this.list[index].name
            }
            this.openWordsTab();
        }

        private openWordsTab() {
            this.$scope.$emit("openWord");
        }

        selectCarryList() {
            this.dataManager.selectedList = {
                _id: "carry",
                name:"carry"
            }
            this.openWordsTab();
        }

        clearCarry() {
            this.transporter.clearCarry().then((res) => {
                if (res.status == 200) {
                    console.log("carry cleared");
                }
            },(err) => {
                    console.error(err);
                });
        }
    }
}