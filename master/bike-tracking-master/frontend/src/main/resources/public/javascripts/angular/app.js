var entrypoint = function () {
    console.log("starting application");
    var main = angular.module("main", ["controllers", "services", "directives", "leaflet-directive"]);

    var controllers = angular.module("controllers", []);
    var services = angular.module("services", []);
    var directives = angular.module("directives", []);

    main.run(function ($rootScope, $timeout) {
        $rootScope.$on('$viewContentLoaded', function () {
            $timeout(function () {
                componentHandler.upgradeAllRegistered();
            })
        })
    });
}();