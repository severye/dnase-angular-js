function getObjects($scope,config,dao,utils){
    console.log($scope.getObjectsPath);
    task = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, $scope.getObjectsPath);
    // on analyse le résultat de l'appel au service [dao]
    task.promise.then(function (result) {
        // fin d'attente
        $scope.waiting.show = false;
        // erreur ?
        if (result.err == 0) {
            $scope.objects.data = result.data;
            $scope.objects.show = true;
            return result.data;
        } else {
            $scope.errors = {
                title: "Erreur",
                messages: utils.getErrors(result),
                show: true
            };
        }
    });
};


// annulation attente
function cancel() {
    // on termine la tâche
    task.reject();
    // on met à jour l'UI
    $scope.waiting.visible = false;
    $scope.errors.show = false;
}

function addObject(id,$scope,dao,config,utils) {
    var name = $scope.addModel.name;
    var post = {name: name};
    task = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, $scope.addOrUpdateObjectPath, post);
    task.promise.then(function (result) {
        $scope.waiting.show = false;
        if (result.err != 0) {
            $scope.errors = {
                title: "Erreur",
                messages: utils.getErrors(result),
                show: true
            };
        } else {
            $scope.addModel.name = '';
            $scope.addModel.code = '';
        }
        getObjects($scope, config, dao);
    })
};

function deleteObject (id,$scope,dao,config,utils) {
    $scope.waiting.show = true;
    var post = {id: id};
    console.log(id);
    task = dao.getData($scope.server.url, $scope.server.login, $scope.server.password, $scope.deleteObjectPath, post);
    task.promise.then(function (result) {
        $scope.waiting.show = false;
        if (result.err != 0) {
            $scope.errors = {
                title: "Erreur",
                messages: utils.getErrors(result),
                show: true
            };
        }
        getObjects($scope, config, dao);
    })
}


var ModalInstanceObjectCtrl = function ($scope, $modalInstance, object, dao,config,utils) {
    $scope.form = {}
    $scope.objectToUpdate = angular.copy(object);
    $scope.submitFormObject = function () {
        if ($scope.form.object.$valid) {
            var name = $scope.objectToUpdate.name;
            var id = $scope.objectToUpdate.id;
            var post = {id: id,name:name};
            task = dao.getData($scope.server.url, $scope.server.login, $scope.server.password,$scope.addOrUpdateObjectPath,post);
            task.promise.then(function(result){
                $scope.waiting.show = false;
                if (result.err != 0) {
                    $scope.errors = {
                        title: "error",
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