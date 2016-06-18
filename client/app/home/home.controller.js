'use strict';

(function() {
    
    function HomeController(){
        console.log('from home page');
    }
    
    angular.module('app')
    .controller('HomeController', HomeController);

})();
