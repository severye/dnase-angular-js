angular.module("danse")
    .controller('colourCtrl', ['$scope', 'utils', 'config', 'dao','$timeout','$modal','$document',
        function ($scope, utils, config, dao, $timeout,$modal,$document) {
            // log
            utils.debug("[colourCtrl] init");
            // contrôle de navigation
            var lastView = $scope.app.view;
            utils.debug("[colourCtrl] lastView", lastView);
            $scope.getObjectsPath = config.urlSvrColours;

            // ------------------- initialisation modèle
            // le msg d'attente
            $scope.waiting = {title: {text: config.msgWaiting, values: {}}, show: false, cancel: cancel, time: 0};
            // les informations de connexion
            $scope.server = {url: 'http://localhost:8080', login: 'severine', password: 'bouillet'};
            // les erreurs
            $scope.errors = {title: {}, messages: [], show: true, model: {}};
            // les coloeur
            $scope.objects = {title: "les couleurs", show: false, id: 'couleurs', data: []};
            $scope.addModel = {name: '', code: ''};
            // on met à jour l'UI
            $scope.waiting.show = false;
            $scope.objects.show = false;
            $scope.errors.show = false;

            // la tâche asynchrone globale
            var task;
            getObjects($scope, config, dao);
            // annulation attente
            function cancel() {
                // on termine la tâche
                task.reject();
                // on met à jour l'UI
                $scope.waiting.visible = false;
                $scope.errors.show = false;
            }

            $scope.deleteColour = function (id) {
                $scope.waiting.show = true;
                var path = config.urlDeleteColour;
                var post = {id: id};
                task = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, path, post);
                task.promise.then(function (result) {
                    $scope.waiting.show = false;
                    if (result.err != 0) {
                        $scope.errors = {
                            title: config.getAgendaErrors,
                            messages: utils.getErrors(result),
                            show: true
                        };
                    }
                    getObjects($scope, config, dao);
                })
            };

            $scope.addColour = function (id) {
                var name = $scope.addModel.name;
                var code = null;
                if($scope.addModel.code!=''){
                    code = "#"+$scope.addModel.code;
                }
                var path = config.urlAddOrUpdateColour;
                var post = {name: name, colorCode: code};
                task = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, path, post);
                task.promise.then(function (result) {
                    $scope.waiting.show = false;
                    if (result.err != 0) {
                        $scope.errors = {
                            title: "Erreur ajout couleur",
                            messages: utils.getErrors(result),
                            show: true
                        };
                    } else {
                        $scope.addModel.name = '';
                        $scope.addModel.code = '';
                    }
                    $('#color span').removeAttr("style");
                    getObjects($scope, config, dao);
                })
            };

            var dialogOptions = {
                controller: 'EditCtrl',
                templateUrl: 'itemEdit.html'
            };

            $scope.edit = function (model) {
                console.log(model);
                var modalInstance = $modal.open({
                    templateUrl: 'popup.html',
                    controller: ModalInstanceCtrl,
                    scope: $scope,
                    resolve: {
                        color: function () {
                            return model;
                        }
                    }
                });
            };
        } ]);


var ModalInstanceCtrl = function ($scope, $modalInstance, color, dao,config,utils) {
    $scope.form = {}
    $scope.colorToUpdate = angular.copy(color);
    $scope.submitForm = function () {
        if ($scope.form.color.$valid) {
            var name = $scope.colorToUpdate.name;
            var code = null;
            if($scope.colorToUpdate.colorCode!=''){
                code = "#"+$scope.colorToUpdate.colorCode.replace("#","");
            }
            var id = $scope.colorToUpdate.id;
            var path = config.urlAddOrUpdateColour;
            var post = {id: id,name:name, colorCode : code};
            task = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, path,post);
            task.promise.then(function(result){
                $scope.waiting.show = false;
                if (result.err != 0) {
                    $scope.errors = {
                        title: config.getAgendaErrors,
                        messages: utils.getErrors(result),
                        show: true
                    };
                }
                getObjects($scope,config,dao);
            })
            $modalInstance.close('closed');
        } else {
            console.log('userform is not in scope');
        }
    };

} ;
