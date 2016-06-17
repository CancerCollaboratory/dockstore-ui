'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:WorkflowFileViewerCtrl
 * @description
 * # WorkflowFileViewerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('WorkflowFileViewerCtrl', [
  	'$scope',
    '$q',
    'WorkflowService',
    'NotificationService',
  	function ($scope, $q, WorkflowService, NtfnService) {

      $scope.descriptor = $scope.workflowObj.descriptorType;

      $scope.fileLoaded = false;
      $scope.fileContents = null;
      $scope.successContent = [];

      $scope.checkDescriptor = function() {
        $scope.workflowVersions = $scope.getWorkflowVersions();
        $scope.successContent = [];
        var accumulator = [];
        var index = 0;
        for (var i=0; i<$scope.workflowVersions.length; i++) {
            accumulator[index] = {ver: $scope.workflowVersions[i]};
            index++;
        }

        var checkSuccess = function(acc) {
          var makePromises = function(acc, start) {
            var vd = acc[start];
            function filePromise(vd){
              return $scope.getDescriptorFile($scope.workflowObj.id, vd.ver, $scope.descriptor).then(
                function(s){
                  $scope.successContent.push({version:vd.ver});
                  if(start+1 === acc.length) {
                    return {success: true, index:start};
                  } else{
                    start++;
                    return filePromise(acc[start]);
                  }
                },
                function(e){
                  if (start+1 === acc.length) {
                    return {success: false, index:start};
                  } else {
                    start++;
                    return filePromise(acc[start]);
                  }
                });
            }
            return filePromise(vd);
          };
          return makePromises(acc,0);
        };

        var successResult = checkSuccess(accumulator);
        successResult.then(
          function(result){
            $scope.selVersionName = $scope.successContent[0].version;
          },
          function(e){console.log("error",e)}
        );
      };

      $scope.filterDescriptor = function(element) {
        for(var i=0;i<$scope.successContent.length;i++){
          if($scope.successContent[i].descriptor === element){
            return true;
          } else{
            if(i===$scope.successContent.length -1){
              return false;
            }
          }
        }
      };

      $scope.filterVersion = function(element) {
        for(var i=0;i<$scope.successContent.length;i++){
          if($scope.successContent[i].version === element){
            return true;
          } else{
            if(i===$scope.successContent.length -1){
              return false;
            }
          }
        }
      };

      $scope.getWorkflowVersions = function() {
        var sortedVersionObjs = $scope.workflowObj.workflowVersions;
        sortedVersionObjs.sort(function(a, b) {
          if (a.name === 'master') return -1;
          if ((new RegExp(/[a-zA-Z]/i).test(a.name.slice(0, 1))) &&
                (new RegExp(/[^a-zA-Z]/i).test(b.name.slice(0, 1)))) return -1;
          /* Lexicographic Sorting */
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        var versions = [];
        for (var i = 0; i < sortedVersionObjs.length; i++) {
          if (!sortedVersionObjs[i].hidden) {
            versions.push(sortedVersionObjs[i].name);
          }
        }
        return versions;
      };

      $scope.getDescriptorFile = function(workflowId, versionName, type) {
        return WorkflowService.getDescriptorFile(workflowId, versionName, type)
          .then(
            function(descriptorFile) {
              // this causes flicker when loading
              //$scope.fileContents = descriptorFile;
              return descriptorFile;
            },
            function(response) {
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.getDescriptorFilePath = function(containerId, tagName, type) {
        return WorkflowService.getDescriptorFilePath(containerId, tagName, type)
          .then(
            function(descriptorFile) {
              $scope.secondaryDescriptors = $scope.secondaryDescriptors.concat(descriptorFile);
              $scope.secondaryDescriptors = $scope.secondaryDescriptors.filter(function(elem, index, self){return index == self.indexOf(elem)})
              return $scope.secondaryDescriptors;
            },
            function(response) {
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.getSecondaryDescriptorFile = function(containerId, tagName, type, secondaryDescriptorPath) {
        return WorkflowService.getSecondaryDescriptorFile(containerId, tagName, type, encodeURIComponent(secondaryDescriptorPath))
          .then(
            function (descriptorFile) {
              $scope.fileContents = descriptorFile;
              return descriptorFile;
            },
            function (response) {
              return $q.reject(response);
            }
          ).finally(
            function () {
              $scope.fileLoaded = true;
            }
          );
      };

      function extracted(){
        try {
          return $scope.workflowObj.workflowVersions.filter(function (a) {
            return a.name === $scope.selVersionName;
          })[0].sourceFiles.filter(function (a) {
            return a.type === 'DOCKSTORE_' + $scope.descriptor.toUpperCase();
          }).map(function (a) {
            return a.path;
          }).sort();
        } catch(err){
          return [];
        }
      }

      $scope.setDocument = function() {
        $scope.descriptor = $scope.workflowObj.descriptorType;
        // prepare Workflow Version drop-down
        $scope.workflowVersions = $scope.workflowObj.workflowVersions.map(function(a) {return a.name;}).sort();
        $scope.selVersionName = $scope.workflowVersions[0];
        // prepare Descriptor Imports drop-down
        $scope.secondaryDescriptors = extracted();
        $scope.selSecondaryDescriptorName = $scope.secondaryDescriptors[0];
      };

      $scope.refreshDocumentType = function() {
        $scope.fileLoaded = false;
        $scope.fileContents = null;
        $scope.expectedFilename = 'Descriptor';
        $scope.secondaryDescriptors = extracted();
        $scope.selSecondaryDescriptorName = $scope.secondaryDescriptors[0];
        $scope.getSecondaryDescriptorFile($scope.workflowObj.id, $scope.selVersionName, $scope.descriptor, $scope.selSecondaryDescriptorName);
      };

      $scope.refreshDocument = function() {
        $scope.fileLoaded = false;
        $scope.fileContents = null;
        $scope.expectedFilename = 'Descriptor';
        $scope.getSecondaryDescriptorFile($scope.workflowObj.id, $scope.selVersionName, $scope.descriptor, $scope.selSecondaryDescriptorName);
      };

      $scope.setDocument();

  }]);
