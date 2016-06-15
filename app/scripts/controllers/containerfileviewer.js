'use strict';

/**
 * @ngdoc function
 * @name dockstore.ui.controller:ContainerFileViewerCtrl
 * @description
 * # ContainerFileViewerCtrl
 * Controller of the dockstore.ui
 */
angular.module('dockstore.ui')
  .controller('ContainerFileViewerCtrl', [
    '$scope',
    '$q',
    'ContainerService',
    'NotificationService',
    function ($scope, $q, ContainerService, NtfnService) {

      var descriptors = ["cwl", "wdl"];

      $scope.fileLoaded = false;
      $scope.fileContents = null;
      $scope.successContent = [];
      $scope.fileContent = null;

      $scope.checkDescriptor = function() {
        $scope.containerTags = $scope.getContainerTags();
        $scope.successContent = [];
        $scope.fileContent = null;
        var accumulator = [];
        var index = 0;
        var inputFound = false;
        var outputFound = false;
        var classFound = false;
        var taskFound = false;
        var workflowFound = false;
        var commandFound = false;
        var callFound = false;
        var m = [];
        var v = false;
        for (var i=0; i<$scope.containerTags.length; i++) {
          for (var j=0; j<descriptors.length; j++) {
            accumulator[index] = {
              tag: $scope.containerTags[i],
              desc: descriptors[j],
              content: null
            };
            index++;
          };
        };

        var checkSuccess = function(acc) {
          var makePromises = function(acc, start) {
            var vd = acc[start];
            function filePromise(vd){
              return $scope.getDescriptorFile($scope.containerObj.id, vd.tag, vd.desc).then(
                function(s){
                  $scope.successContent.push({
                    tag:vd.tag,
                    descriptor:vd.desc,
                    content:s
                  });
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
            $scope.selTagName = $scope.successContent[0].tag;
            $scope.selDescriptorName = $scope.successContent[0].descriptor;
            $scope.fileContent = $scope.successContent[0].content;
            var result = $scope.fileContent.toLowerCase();
            m = [];
            v = false;
            if($scope.selDescriptorName === "cwl"){
              //Descriptor: CWL
              if(result.search("inputs:") !== -1){
                inputFound = true;
              }else{
                m.push('inputs');
              }

              if(result.search("outputs:") !== -1){
                outputFound = true;
              }else{
                m.push('outputs');
              }

              if(result.search("basecommand:") !== -1){
                commandFound = true;
              }else{
                m.push('baseCommand');
              }

              if(result.search("class:") !== -1){
                classFound = true;
              }else{
                m.push('class');
              }

              if(inputFound && outputFound && classFound && commandFound){
                v = true;
              } else{
                v = false;
              }
            } else{
              //Descriptor: WDL
              if(result.search('task') !== -1){
                taskFound = true;
              }else{
                m.push('task');
              }

              if(result.search('workflow') !== -1){
                workflowFound = true;
              }else{
                m.push('workflow');
              }

              if(result.search('call') !== -1){
                callFound = true;
              }else{
                m.push('call');
              }

              if(result.search('command') !== -1){
                commandFound = true;
              }else{
                m.push('command');
              }

              if(result.search('output') !== -1){
                outputFound = true;
              }else{
                m.push('output');
              }

              if(taskFound && workflowFound && commandFound && callFound && outputFound){
                v = true;
              } else{
                v = false;
              }
            }
            $scope.$emit('returnMissing',m);
            $scope.$emit('returnValid',v);
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
          if($scope.successContent[i].tag === element){
            return true;
          } else{
            if(i===$scope.successContent.length -1){
              return false;
            }
          }
        }
      };

      $scope.isDockerfile = function() {
        if ($scope.type === 'dockerfile'){
          return true;
        } else {
          return false;
        }
      };

      $scope.getContainerTags = function() {
        var sortedTagObjs = $scope.containerObj.tags;
        sortedTagObjs.sort(function(a, b) {
          if (a.name === 'latest') return -1;
          if ((new RegExp(/[a-zA-Z]/i).test(a.name.slice(0, 1))) &&
                (new RegExp(/[^a-zA-Z]/i).test(b.name.slice(0, 1)))) return -1;
          /* Lexicographic Sorting */
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        var tags = [];
        for (var i = 0; i < sortedTagObjs.length; i++) {
          if (!sortedTagObjs[i].hidden) {
            tags.push(sortedTagObjs[i].name);
          }
        }
        return tags;
      };

      $scope.getDockerFile = function(containerId, tagName) {
        return ContainerService.getDockerFile(containerId, tagName)
          .then(
            function(dockerFile) {
              $scope.fileContents = dockerFile;
              return dockerFile;
            },
            function(response) {
              return $q.reject(response);
            }
          )
          .finally(
            function() { $scope.fileLoaded = true; }
          );
      };

      $scope.getDescriptorFile = function(containerId, tagName, type) {
        return ContainerService.getDescriptorFile(containerId, tagName, type)
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
        $scope.containerTags = $scope.getContainerTags();
        $scope.selTagName = $scope.containerTags[0];
        $scope.descriptors = descriptors;
        $scope.selDescriptorName = descriptors[0];
      };

      $scope.refreshDocument = function() {
        $scope.fileLoaded = false;
        $scope.fileContents = null;
        switch ($scope.type) {
          case 'dockerfile':
            $scope.expectedFilename = 'Dockerfile';
            $scope.getDockerFile($scope.containerObj.id, $scope.selTagName);
            break;
          case 'descriptor':
            $scope.expectedFilename = 'Descriptor';
            $scope.getDescriptorFile($scope.containerObj.id, $scope.selTagName, $scope.selDescriptorName);
            break;
          default:
            // ...
        }
      };

      $scope.setDocument();

  }]);