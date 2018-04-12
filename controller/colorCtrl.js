// decorator - all variables in options can be globally overridden here
angular
    .module('danse')
    .config(function($provide) {
        $provide.decorator('ColorPickerOptions', function($delegate) {
            var options = angular.copy($delegate);
            options.round = true;
            options.alpha = false;
            options.format = 'hex';
            return options;
        });
    });