'use strict';

describe('Service: WorkflowService', function () {

  // load the service's module
  beforeEach(module('dockstore.ui'));

  // instantiate service
  var WorkflowService, httpBackend;

  beforeEach(inject(function (_WorkflowService_, $httpBackend) {
    WorkflowService = _WorkflowService_;
    httpBackend = $httpBackend;
  }));

  it('should mock get descriptor file', function(){
    httpBackend.whenGET("http://localhost:8080/workflows/1033/cwl?tag=master").respond({
      "id": 1495,
      "type": "DOCKSTORE_CWL",
      "content": "#\n# This is a two-step workflow which uses \"revtool\" and \"sorttool\" defined above.\n#\nclass: Workflow\ndescription: \"A demonstration of a CWL workflow. This reverses the lines in a document and then sorts those lines.\"\ncwlVersion: cwl:draft-3\n\n# Requirements & hints specify prerequisites and extensions to the workflow.\n# In this example, DockerRequirement specifies a default Docker container\n# in which the command line tools will execute.\nhints:\n  - class: DockerRequirement\n    dockerPull: debian:8\n\n\n# The inputs array defines the structure of the input object that describes\n# the inputs to the workflow.\n#\n# The \"reverse_sort\" input parameter demonstrates the \"default\" field.  If the\n# field \"reverse_sort\" is not provided in the input object, the default value will\n# be used.\ninputs:\n  - id: input\n    type: File\n    description: \"The input file to be processed.\"\n  - id: reverse_sort\n    type: boolean\n    default: true\n    description: \"If true, reverse (decending) sort\"\n\n# The \"outputs\" array defines the structure of the output object that describes\n# the outputs of the workflow.\n#\n# Each output field must be connected to the output of one of the workflow\n# steps using the \"connect\" field.  Here, the parameter \"#output\" of the\n# workflow comes from the \"#sorted\" output of the \"sort\" step.\noutputs:\n  - id: output\n    type: File\n    source: \"#sorted/output\"\n    description: \"The output with the lines reversed and sorted.\"\n\n# The \"steps\" array lists the executable steps that make up the workflow.\n# The tool to execute each step is listed in the \"run\" field.\n#\n# In the first step, the \"inputs\" field of the step connects the upstream\n# parameter \"#input\" of the workflow to the input parameter of the tool\n# \"revtool.cwl#input\"\n#\n# In the second step, the \"inputs\" field of the step connects the output\n# parameter \"#reversed\" from the first step to the input parameter of the\n# tool \"sorttool.cwl#input\".\nsteps:\n  - id: rev\n    inputs:\n      - { id: input, source: \"#input\" }\n    outputs:\n      - { id: output }\n    run: revtool.cwl\n\n\n  - id: sorted\n    inputs:\n      - { id: input, source: \"#rev/output\" }\n      - { id: reverse, source: \"#reverse_sort\" }\n    outputs:\n      - { id: output }\n    run: sorttool.cwl\n",
      "path": "/Dockstore.cwl"
    });
    WorkflowService.getDescriptorFile(1033,'master','cwl')
      .then(function(response){
        expect(response).toBe("#\n# This is a two-step workflow which uses \"revtool\" and \"sorttool\" defined above.\n#\nclass: Workflow\ndescription: \"A demonstration of a CWL workflow. This reverses the lines in a document and then sorts those lines.\"\ncwlVersion: cwl:draft-3\n\n# Requirements & hints specify prerequisites and extensions to the workflow.\n# In this example, DockerRequirement specifies a default Docker container\n# in which the command line tools will execute.\nhints:\n  - class: DockerRequirement\n    dockerPull: debian:8\n\n\n# The inputs array defines the structure of the input object that describes\n# the inputs to the workflow.\n#\n# The \"reverse_sort\" input parameter demonstrates the \"default\" field.  If the\n# field \"reverse_sort\" is not provided in the input object, the default value will\n# be used.\ninputs:\n  - id: input\n    type: File\n    description: \"The input file to be processed.\"\n  - id: reverse_sort\n    type: boolean\n    default: true\n    description: \"If true, reverse (decending) sort\"\n\n# The \"outputs\" array defines the structure of the output object that describes\n# the outputs of the workflow.\n#\n# Each output field must be connected to the output of one of the workflow\n# steps using the \"connect\" field.  Here, the parameter \"#output\" of the\n# workflow comes from the \"#sorted\" output of the \"sort\" step.\noutputs:\n  - id: output\n    type: File\n    source: \"#sorted/output\"\n    description: \"The output with the lines reversed and sorted.\"\n\n# The \"steps\" array lists the executable steps that make up the workflow.\n# The tool to execute each step is listed in the \"run\" field.\n#\n# In the first step, the \"inputs\" field of the step connects the upstream\n# parameter \"#input\" of the workflow to the input parameter of the tool\n# \"revtool.cwl#input\"\n#\n# In the second step, the \"inputs\" field of the step connects the output\n# parameter \"#reversed\" from the first step to the input parameter of the\n# tool \"sorttool.cwl#input\".\nsteps:\n  - id: rev\n    inputs:\n      - { id: input, source: \"#input\" }\n    outputs:\n      - { id: output }\n    run: revtool.cwl\n\n\n  - id: sorted\n    inputs:\n      - { id: input, source: \"#rev/output\" }\n      - { id: reverse, source: \"#reverse_sort\" }\n    outputs:\n      - { id: output }\n    run: sorttool.cwl\n");
    });
    httpBackend.flush();
  });

  // it('should do something', function () {
  //   expect(!!WorkflowService).toBe(true);
  // });

});
