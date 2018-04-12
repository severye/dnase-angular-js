"use strict";

angular.module("danse", ["ngRoute",'base64', 'ngLocale', 'ui.bootstrap','color.picker'])
.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/colorManager",
        {
            templateUrl: "views/manageColours.html",
            controller: 'colourCtrl'
        });
    $routeProvider.when("/categoryManager",
        {
            templateUrl: "views/manageObject.html",
            controller: 'categoryCtrl'
        });
    $routeProvider.when("/boxManager",
        {
            templateUrl: "views/manageObject.html",
            controller: 'boxCtrl'
        });
    $routeProvider.when("/kindManager",
        {
            templateUrl: "views/manageObject.html",
            controller: 'kindCtrl'
        });
    $routeProvider.when("/typeManager",
        {
            templateUrl: "views/manageObject.html",
            controller: 'typeCtrl'
        });
    $routeProvider.when("/sizeManager",
        {
            templateUrl: "views/manageObject.html",
            controller: 'sizeCtrl'
        });
    $routeProvider.when("/productManager",
        {
            templateUrl: "views/manageProduct.html",
            controller: 'productCtrl'
        });
    $routeProvider.otherwise(
        {
            redirectTo: "/"
        });
}]);
