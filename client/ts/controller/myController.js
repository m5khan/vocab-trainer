/// <reference path="../../app.ts"/>
var vocab;
(function (vocab) {
    "use strict";
    var MyController = (function () {
        function MyController($scope) {
            this.$scope = $scope;
            console.log("inside myController");
            $scope.myname = "Shoaib Khan";
            $scope.vm = this;
        }
        MyController.$inject = [
            '$scope'
        ];
        return MyController;
    })();
    vocab.MyController = MyController;
})(vocab || (vocab = {}));
//# sourceMappingURL=myController.js.map