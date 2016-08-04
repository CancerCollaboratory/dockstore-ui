'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:FootnoteCtrl
 * @description
 * # FootnoteCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('FootnoteCtrl', [
    '$scope',
    'TokenService',
    function ($scope, TokenService) {

      $scope.metadata = function(){
        return TokenService.getWebServiceVersion()
          .then(
            function(resultFromApi) {
              $scope.apiVersion = resultFromApi.version;
              $scope.ga4ghApiVersion = resultFromApi.apiVersion;
            },
            function(response) {
              var message = '[HTTP ' + response.status + '] ' +
                response.statusText + ': ' + response.data;
              TokenService.popError('Metadata', message);
              return $q.reject(response);
            }
          );
      };

      $scope.metadata();

  }]);
