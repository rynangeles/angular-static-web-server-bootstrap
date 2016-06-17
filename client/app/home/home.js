'use strict';

(function() {
    
    function homeConfig($stateProvider) {
        $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/home/home.html',
            controller: 'HomeController',
            controllerAs: 'home'
        });
    }

    angular.module('macMobieApp')
    .config(homeConfig);

})();