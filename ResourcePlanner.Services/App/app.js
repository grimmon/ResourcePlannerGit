(function () {
    'use strict';

    angular.module('app', [
        // Angular modules
        'ngAnimate',
        'ngRoute',
        'AdalAngular'
        // Custom modules

        // 3rd Party Modules
        
    ]).config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalProvider) {

        $routeProvider.when("/api", {
            requireADLogin: true,
        }).otherwise({ redirectTo: "/Home" });

        adalProvider.init(
            {
                instance: 'https://login.microsoftonline.com/',
                tenant: 'mattjacksonyahoo.onmicrosoft.com',
                //clientId: 'e36e4a47-114e-41a6-abb0-160b8ead8098',
                clientId: '55324854-cfd5-4d16-bf63-556abddbdf83',
                extraQueryParameter: 'nux=1',
                //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
            },
            $httpProvider
            );
    }])});

