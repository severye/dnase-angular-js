angular.module("danse")
    .controller('sizeCtrl', ['$scope', 'utils', 'config', 'dao','$timeout','$modal','$document',
        function ($scope, utils, config, dao, $timeout,$modal,$document) {
            $scope.getObjectsPath = config.urlSvrSizes;
            $scope.addOrUpdateObjectPath = config.urlAddOrUpdateSize;
            $scope.deleteObjectPath = config.urlDeleteSize;
            // log
            utils.debug("[sizeCtrl] init");
            // contrôle de navigation
            var lastView = $scope.app.view;
            utils.debug("[sizeCtrl] lastView", lastView);

            // ------------------- initialisation modèle
            // le msg d'attente
            $scope.waiting = {title: {text: config.msgWaiting, values: {}}, show: false, cancel: cancel, time: 0};
            // les informations de connexion
            $scope.server = {url: 'http://localhost:8080', login: 'severine', password: 'bouillet'};
            // les erreurs
            $scope.errors = {title: {}, messages: [], show: true, model: {}};
            // les coloeur
            $scope.objects = {title: "les tailles", show: false, id: 'sizes', data: []};
            $scope.addModel = {name: ''};
            // on met à jour l'UI
            $scope.waiting.show = false;
            $scope.objects.show = false;
            $scope.errors.show = false;

            $scope.title="Gestion des tailles";

            // la tâche asynchrone globale
            var task;

            // -------------------------------- méthodes
            // on met à jour l'UI
            $scope.waiting.show = true;
            $scope.errors.show = false;

            getObjects($scope, config, dao);


            $scope.delete = function (id) {
                deleteObject(id,$scope,dao,config,utils);
            };

            $scope.add = function (id) {
                addObject(id,$scope,dao,config,utils);
            };

            var dialogOptions = {
                controller: 'EditCtrl',
                templateUrl: 'itemEdit.html'
            };

            $scope.edit = function (model) {
                var modalInstance = $modal.open({
                    templateUrl: 'popupObject.html',
                    controller: ModalInstanceObjectCtrl,
                    scope: $scope,
                    resolve: {
                        object: function () {
                            return model;
                        }
                    }
                });
            };
        } ]);

