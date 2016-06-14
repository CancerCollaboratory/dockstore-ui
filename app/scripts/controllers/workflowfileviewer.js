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

      var descriptors = ["cwl", "wdl"];

      $scope.fileLoaded = false;
      $scope.fileContents = null;
      $scope.successContent = [];

      $scope.getFileContent = function() {
        console.log("getFileContent");
        var inputFound = false;
        var outputFound = false;
        var stepsFound = false;
        var classFound = false;
        var taskFound = false;
        var workflowFound = false;
        var commandFound = false;
        var callFound = false;

        $scope.getDescriptorFile($scope.workflowObj.id, $scope.selVersionName, $scope.selDescriptorName).then(
        function(result){
          result = result.toLowerCase();
          if($scope.selDescriptorName === "cwl"){
            //Descriptor: CWL
            if(result.search("inputs:") !== -1){
              inputFound = true;
            }else{
              $scope.$emit('returnMissing','inputs');
            }

            if(result.search("outputs:") !== -1){
              outputFound = true;
            }else{
              $scope.$emit('returnMissing','outputs');
            }

            if(result.search("steps:") !== -1){
              stepsFound = true;
            }else{
              $scope.$emit('returnMissing','steps');
            }

            if(result.search("class:") !== -1){
              classFound = true;
            }else{
              $scope.$emit('returnMissing','class');
            }

            if(inputFound && outputFound && classFound && stepsFound){
              $scope.$emit('returnValid',true);
            } else{
              $scope.$emit('returnValid', false);
            }
          } else{
            //Descriptor: WDL
            if(result.search('task') !== -1){
              taskFound = true;
            }else{
              $scope.$emit('returnMissing','task');
            }

            if(result.search('workflow') !== -1){
              workflowFound = true;
            }else{
              $scope.$emit('returnMissing','workflow');
            }

            if(result.search('call') !== -1){
              callFound = true;
            }else{
              $scope.$emit('returnMissing','call');
            }

            if(result.search('command') !== -1){
              commandFound = true;
            }else{
              $scope.$emit('returnMissing','command');
            }

            if(result.search('output') !== -1){
              outputFound = true;
            }else{
              $scope.$emit('returnMissing','output');
            }

            if(taskFound && workflowFound && commandFound && callFound && outputFound){
              $scope.$emit('returnValid', true);
            } else{
              $scope.$emit('returnValid', false);
            }
          }
        },
        function(e){console.log("error",e)}
      );
    };

      $scope.checkDescriptor = function() {
        $scope.workflowVersions = $scope.getWorkflowVersions();
        $scope.successContent = [];
        var accumulator = [];
        var index = 0;
        for (var i=0; i<$scope.workflowVersions.length; i++) {
          for (var j=0; j<descriptors.length; j++) {
            accumulator[index] = {ver: $scope.workflowVersions[i], desc: descriptors[j]};
            index++;
          };
        };

        var checkSuccess = function(acc) {
          var makePromises = function(acc, start) {
            var vd = acc[start];
            function filePromise(vd){
              return $scope.getDescriptorFile($scope.workflowObj.id, vd.ver, vd.desc).then(
                function(s){
                  $scope.successContent.push({version:vd.ver,descriptor:vd.desc});
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
                  };
                });
            }
            return filePromise(vd);
          };
          return makePromises(acc,0);
        }

        var successResult = checkSuccess(accumulator);
        successResult.then(
          function(result){
            $scope.selVersionName = $scope.successContent[0].version;
            $scope.selDescriptorName = $scope.successContent[0].descriptor;
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
              $scope.fileContents = descriptorFile;
              return descriptorFile;
            },
            function(response) {
              return $q.reject(response);
            }
          ).finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.setDocument = function() {
        $scope.workflowVersions = $scope.getWorkflowVersions();
        $scope.selVersionName = $scope.workflowVersions[0];
        $scope.descriptors = descriptors;
        $scope.selDescriptorName = descriptors[0];
      };

      $scope.refreshDocument = function() {
        $scope.fileLoaded = false;
        $scope.fileContents = null;
        $scope.expectedFilename = 'Descriptor';
        $scope.getDescriptorFile($scope.workflowObj.id, $scope.selVersionName, $scope.selDescriptorName);
      };    
      
      $scope.setDocument();

  }]);
