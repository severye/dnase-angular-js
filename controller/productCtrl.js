angular.module("danse")
    .controller('productCtrl', ['$scope', 'utils', 'config', 'dao','$timeout','$modal','$document','fileUpload',
        function ($scope, utils, config, dao, $timeout,$modal,$document,fileUpload) {
            // log
            utils.debug("[colourCtrl] init");
            // contrôle de navigation
            var lastView = $scope.app.view;
            utils.debug("[colourCtrl] lastView", lastView);
            $scope.getObjectsPath = config.urlSvrProducts;
            $scope.deleteObjectPath = config.urlDeleteProduct;

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
            getObjects($scope, config, dao,utils);
            $scope.delete = function (id) {
                deleteObject(id,$scope,dao,config,utils);
            };
            var dialogOptions = {
                controller: 'EditCtrl',
                templateUrl: 'itemEdit.html'
            };

            function cancel() {
                // on termine la tâche
                task.reject();
                // on met à jour l'UI
                $scope.waiting.visible = false;
                $scope.errors.show = false;
            }
            var colours;
            var categories;
            var kinds;
            var types;
            var boxes;

            $scope.uploadFile = function(){
                var file = $scope.myFile;

                console.log('file is ' );
                console.dir(file);

                var uploadUrl = "/assets";

                fileUpload.uploadFileToUrl(file, uploadUrl);
            };

            $scope.edit = function (model) {
                var promiseCategory;
                var promiseBox;
                var promiseColors;
                var promiseCategory;
                var promiseKind;
                var promiseType;
                if(colours ==null){
                    console.log("in");
                    task = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, config.urlSvrColours);
                    promiseColors = task.promise;
                    // on analyse le résultat de l'appel au service [dao]
                    promiseColors = promiseColors.then(function (result) {
                        // erreur ?
                        if (result.err == 0) {
                            colours = result.data;
                        } else {
                            return null;
                        }
                    });
                }

                var taskCategories = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, config.urlSvrCategories);
                promiseCategory = taskCategories.promise;
                promiseCategory = promiseCategory.then(function (result) {
                    // erreur ?
                    if (result.err == 0) {
                        categories = result.data;
                    } else {
                        return null;
                    }
                });
                var taskKinds= dao.getData($scope.server.url, $scope.server.login, $scope.server.password, config.urlSvrKinds);
                promiseKind = taskKinds.promise;
                promiseKind = promiseKind.then(function (result) {
                    // erreur ?
                    if (result.err == 0) {
                        kinds = result.data;
                    } else {
                        return null;
                    }
                });
                var taskTypes = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, config.urlSvrTypes);
                promiseType = taskTypes.promise;
                promiseType = promiseType.then(function (result) {
                    // erreur ?
                    if (result.err == 0) {
                        types = result.data;
                    } else {
                        return null;
                    }
                });
                var taskBoxes = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, config.urlSvrBoxes);
                promiseBox = taskBoxes.promise;
                promiseBox = promiseBox.then(function (result) {
                    // erreur ?
                    if (result.err == 0) {
                        boxes = result.data;
                    } else {
                        return null;
                    }
                });
                Promise.all([promiseType, promiseKind, promiseCategory,promiseBox,promiseColors]).then(function(values) {
                    var modalInstance = $modal.open({
                        templateUrl: 'popupProduct.html',
                        controller: ModalInstanceProductCtrl,
                        scope: $scope,
                        resolve: {
                            product: function () {
                                return model;
                            },
                            colors : function(){
                                return colours;
                            },
                            categories : function(){
                                return categories;
                            },
                            kinds : function(){
                                return kinds;
                            },
                            types : function(){
                                return types;
                            },
                            boxes : function(){
                                return boxes;
                            }
                        }
                    });
                });
            };
        } ]);


var ModalInstanceProductCtrl = function ($scope, $modalInstance, product,colors,kinds,categories,types,boxes, dao,config,utils) {
    $scope.form = {};
    $scope.categories = categories;
    $scope.colors = colors;
    $scope.productToUpdate = angular.copy(product);
    $scope.kinds = kinds;
    $scope.types = types;
    $scope.boxes = boxes;
    $scope.submitForm = function () {
        if ($scope.form.product.$valid) {
            var name = $scope.productToUpdate.name;
            var comment = $scope.productToUpdate.comment;
            var totalQuantity = $scope.productToUpdate.totalQuantity;
            var picture="test.jpg";
            var category = $scope.productToUpdate.category.id;
            var kind = $scope.productToUpdate.kind.id;
            var type = $scope.productToUpdate.type.id;
            var colour = $scope.productToUpdate.colour.id;
            var box = $scope.productToUpdate.box.id;

            var id = $scope.productToUpdate.id;
            var path = config.urlAddOrUpdateProduct;
            var post = {id: id,name:name, comment : comment, totalQuantity : totalQuantity,picture:picture,idKind:kind,idCategory:category,idType:type,idBox:box,idColour:colour};
            task = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, path,post);
            task.promise.then(function(result){
                $scope.waiting.show = false;
                console.log(result);
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