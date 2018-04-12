angular.module("danse")
    .controller('kindCtrl', ['$scope', 'utils', 'config', 'dao','$timeout','$modal','$document',
        function ($scope, utils, config, dao, $timeout,$modal,$document) {
            $scope.getObjectsPath = config.urlSvrKinds;
            $scope.addOrUpdateObjectPath = config.urlAddOrUpdateKind;
            $scope.deleteObjectPath = config.urlDeleteKind;
            // log
            utils.debug("[kindCtrl] init");
            // contrôle de navigation
            var lastView = $scope.app.view;
            utils.debug("[kindCtrl] lastView", lastView);

            // ------------------- initialisation modèle
            // le msg d'attente
            $scope.waiting = {title: {text: config.msgWaiting, values: {}}, show: false, cancel: cancel, time: 0};
            // les informations de connexion
            $scope.server = {url: 'http://localhost:8080', login: 'severine', password: 'bouillet'};
            // les erreurs
            $scope.errors = {title: {}, messages: [], show: true, model: {}};
            // les coloeur
            $scope.objects = {title: "les genres", show: false, id: 'kinds', data: []};
            $scope.addModel = {name: ''};
            // on met à jour l'UI
            $scope.waiting.show = false;
            $scope.objects.show = false;
            $scope.errors.show = false;

            $scope.title="Gestion des genres";

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

