angular.module("danse")
    .factory('utils', ['config', '$timeout', '$q', function (config, $timeout, $q) {

        // affichage de la représentation Json d'un objet
        function debug(message, data) {
            console.log(angular.toJson(data));
            if (config.debug) {
                var text = data ? message + " : " + angular.toJson(data) : message;
                console.log(text);
            }
        }

        // attente
        function waitForSomeTime(milliseconds) {
            // attente asynchrone de milliseconds milli-secondes
            var task = $q.defer();
            $timeout(function () {
                task.resolve();
            }, milliseconds);
            // on retourne la tâche
            return task;
        }

        // analyse des erreurs dans la réponse du serveur JSON
        function getErrors(data, $filter) {
            // data {err:n, messages:[]}, err!=0
            // erreurs
            var errors = [];
            // code d'erreur
            var err = data.err;
            switch (err) {
                case 2:
                    // not authorized
                    errors.push('not_authorized');
                    break;
                case 3:
                    // forbidden
                    errors.push('forbidden');
                    break;
                case 4:
                    // erreur locale
                    errors.push('not_http_error');
                    break;
                case 6:
                    // document non trouvé
                    errors.push('not_found');
                    break;
                default:
                    // autres cas
                    errors = data.messages;
                    break;

            }
            // si pas de msg, on en met un
            if (!errors || errors.length == 0) {
                errors = "error";
            }
            // on rend la liste des erreurs
            return errors;
        }


        // instance du service
        return {
            debug: debug,
            waitForSomeTime: waitForSomeTime,
            getErrors: getErrors,
        }
    } ]);