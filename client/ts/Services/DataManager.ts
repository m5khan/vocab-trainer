module vocab
{
    'use strict';
    export class DataManager {

        list: IList[];
        private _selectedList: IList;

        constructor() {
            console.log("inside DataManager constructor");
        }

        get selectedList(): IList {
            return this._selectedList;
        }

        set selectedList(listObj:IList) {
            this._selectedList = listObj;
        }

    }
}

 