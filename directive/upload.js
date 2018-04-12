angular.module("danse").directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            console.log('in');
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

angular.module("danse").service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        console.log(file);
        var fd = new FormData();
        fd.append('file', file);

        var promise = $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        promise.then(success, failure);
        // on retourne la tâche elle-même afin qu'elle puisse être annulée
        return task;

        function success(response) {

            console.log(response);
        }

        // failure
        function failure(response) {
            console.log(response);
        }
    }
}]);
      