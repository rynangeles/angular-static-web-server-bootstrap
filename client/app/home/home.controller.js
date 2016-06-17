'use strict';

(function() {
    
    function HomeController(){
        console.log('from home page');
    }
    
    angular.module('macMobieApp')
    .controller('HomeController', HomeController);

})();
