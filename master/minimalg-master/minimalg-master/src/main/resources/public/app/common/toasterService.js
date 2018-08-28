"use strict";
angular.module('mg.common')
    .service('toasterService', function (toaster) {
        var messageCache = {error: null,
            success: null,
            warning: null};

        var notifyUser = function (text, it) {
            var notificationType = _.keys(messageCache)[it];
            function textHasChanged(text) {
                return JSON.stringify(text) !== JSON.stringify(messageCache[notificationType]);
            }

            function capitalize(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            function notify(text) {
                messageCache[notificationType] = text;
                toaster.pop(notificationType, capitalize(notificationType), text);
            }

            if (textHasChanged(text)) {
                notify(text);
            }

        };

        this.error = function (text) {
            notifyUser(text, 0);
        };

        this.success = function (text) {
            notifyUser(text, 1);
        };

        this.warning = function (text) {
            notifyUser(text, 2);
        };
    });