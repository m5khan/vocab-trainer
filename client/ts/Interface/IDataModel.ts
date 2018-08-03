module vocab
{
    "use strict";
    export interface IWord {
        _id: string;
        listid: string;
        word: string;
        meaning: string[];
        sentence: string[];
        mastered?: boolean;
        arrIndex?: number;
    }

    export interface IWordEdit {
        _id?: string;
        listid?: string;
        arrIndex?: number;
        word: string;
        meaning: string[];
        sentence: string[];
        mastered?: boolean;
    }

    export interface IList { //in use
        _id: string;
        name: string;
    }

    export interface IUser { // not in use
        userId: string;
        name: string;
        Lists: IList[];
    }

    export interface Ilogin { //in use
        email: string;
        pass: string;
    }

    export interface IError {
        show: boolean;
        message: string;
    }

    export enum Menu {
        list = 1,
        words = 2
    }

    export enum WordFlags {
        list = 1,
        edit = 2,
        add = 3,
        detail = 4,
        flashcard = 5
    }
} 

