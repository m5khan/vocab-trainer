///< reference path="ts/interface/IMainCtrlScope.ts"/>
///< reference path="ts/interface/IDataModel.ts/>


module vocab
{
    "use strict";
    export class MainCtrl {
        homeSwitch: boolean = false;
        signinSwitch: boolean = false;
        mainView: string = "main";
        user: Ilogin;

        public static $inject = [
            '$scope',
            'transporter'
        ];

        constructor(private $scope: IMainCtrlScope, private transporter:Transporter) {
            console.log("inside mainCtrl");
            $scope.vm = this;
            this.loginSession();
        }


        homeClick() {
            this.homeSwitch = true;
            this.signinSwitch = false;
        }

        signinClick() {
            this.homeSwitch = false;
            this.signinSwitch = true;
        }

        loginHandler() {
            this.mainView = "app";
        }

        loginClick(user: Ilogin) {
            var promise = this.transporter.login(user);
            promise.then((data) => {
                console.log("login successful", data);
                this.loginHandler();
            },
                (err) => {
                    console.log("login failed", err);
                    alert("login failed");
                });
        }

        /*
        * checks if user is logged in and redirect him to main app without login process
        */
        private loginSession() {
            this.transporter.isLoggedin().then((res) => {
                console.log(res);
                if (res.status == 200) {
                    this.loginHandler();
                } else {
                    this.homeSwitch = true;
                }
            },(err) => {
                    console.error(err);
                    this.homeSwitch = true;
                });
        }
    }
} 