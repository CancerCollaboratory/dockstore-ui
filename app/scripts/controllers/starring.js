/*
 *    Copyright 2016 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:StarringCtrl
 * @description
 * # StarringCtrl
 * Controller of the dockstore.ui
 */

angular.module('dockstore.ui')
  .controller('StarringCtrl', [
    '$scope',
    '$q',
    '$auth',
    'UserService',
    'StarringService',
    'md5',
    function($scope, $q, $auth, UserService, StarringService, md5) {
      $scope.userObj = UserService.getUserObj();
      $scope.max = 1;
      $scope.isReadonly = false;
      $scope.ratingStates = [{
        stateOn: 'glyphicon-star',
        stateOff: 'glyphicon-star-empty'
      }];
      $scope.isLoggedIn = function() {
        return !($scope.userObj === null || $scope.userObj === undefined);
      };
      /**
       * This function checks whether the user starred the workflow/tool
       *
       * @param  {type} userObj   The user object
       * @param  {type} entryId   The ID of the workflow or tool
       * @param  {type} entryType "workflow" or "tool"
       * @return {type}           1 if the user starred the workflow or tool,
       *                          0 otherwise.
       */
      $scope.getStarring = function(userObj, entryId, entryType) {
        return StarringService.getStarring(userObj, entryId, entryType)
          .then(
            function(starring) {
              for (var star in starring) {
                if (userObj.id === starring[star].id) {
                  return 1;
                }
                return 0;
              }
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify labels ' +
                'for this workflow, please ensure that the label list is ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      /**
       * This function stars/unstars the workflow/tool and then updates total_stars
       *
       * @param  {type} userObj   The user object
       * @param  {type} entryId   The ID of the workflow or tool
       * @param  {type} entryType "workflow" or "tool"
       * @return {type}           Void
       */
      $scope.setStarring = function(userObj, entryId, entryType) {
        if ($scope.isLoggedIn) {
          $scope.setStar(userObj, entryId, entryType).then(function(data) {
            $scope.getStarredUsers($scope.userObj, $scope.entryId, $scope.entryType).then(function(data2) {
              $scope.total_stars = data2;
            });
          });
        }

      };

      /**
       * This function stars/unstars the workflow/tool by the user
       *
       * @param  {type} userObj   The user object
       * @param  {type} entryId   The ID of the workflow or tool
       * @param  {type} entryType "workflow" or "tool"
       * @return {type}           Void
       */
      $scope.setStar = function(userObj, entryId, entryType) {
        if ($scope.rate === 0) {
          return StarringService.setUnstar($scope.userObj, entryId, entryType);
        } else {
          return StarringService.setStar($scope.userObj, entryId, entryType);
        }
      };

      /**
       * This function gets the number of users that starred the workflow or tool
       *
       * @param  {type} userObj   The user object
       * @param  {type} entryId   The ID of the workflow or tool
       * @param  {type} entryType "workflow" or "tool"
       * @return {type}           The amount of users that starred the workflow or tool
       */
      $scope.getStarredUsers = function(userObj, entryId, entryType) {
        return StarringService.getStarring(userObj, entryId, entryType)
          .then(
            function(starring) {
              return starring.length;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify labels ' +
                'for this workflow, please ensure that the label list is ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };

      $scope.setDocument = function() {
        if ((typeof $scope.workflowObj) !== 'undefined') {
          $scope.entryId = $scope.workflowObj.id;
          $scope.entryType = 'workflow';
        } else {
          $scope.entryId = $scope.containerObj.id;
          $scope.entryType = 'container';
        }
      };
      const gravatarUrl = (email, defaultImg) => ("https://www.gravatar.com/avatar/" + md5.createHash(email) + "?d=" + defaultImg);
      /**
       * Gets stargazers of this workflow/tool.
       *
       * @param  {type} entryId   Workflow/tool ID
       * @param  {type} entryType "Workflow" or "Tool"
       * @return {type}           None
       */
      $scope.getStargazers = function(entryId, entryType) {
        return StarringService.getStarring($scope.userObj, entryId, entryType)
          .then(
            function(starring) {
              $scope.starGazers.users = starring;
              $scope.starGazers.users.forEach(function(user) {
              user.avatarUrl = gravatarUrl(user.email, user.avatarUrl);
              });
              $scope.starGazers.clicked = true;
            },
            function(response) {
              $scope.setWorkflowDetailsError(
                'The webservice encountered an error trying to modify labels ' +
                'for this workflow, please ensure that the label list is ' +
                'properly-formatted and does not contain prohibited ' +
                'characters of words.',
                '[HTTP ' + response.status + '] ' + response.statusText + ': ' +
                response.data
              );
              return $q.reject(response);
            }
          );
      };
    }
  ]);
