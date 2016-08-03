# Getting Started with CWL

## Describe Your Tool

Now that you have a git repository that includes a `Dockerfile`, you have tested it, and are satisfied that your tool works in Docker, the next step is to create a [CWL tool definition file](http://www.commonwl.org/). This YAML file describes the inputs, outputs, and Docker image dependencies for your tool.

It is recommended that you have the following minimum fields:

    description: <description>
    id: <id>
    label: <label>
    
    dct:creator:
      foaf:name: <name>

Again, we provide an example from the [dockstore-tool-bamstats](https://github.com/briandoconnor/dockstore-tool-bamstats) repository:

![Dockstore.cwl](docs/cwl.png)

You can see this tool takes two inputs, a parameter to control memory usage and a BAM file (binary sequence alignment file).  It produces one output, a zip file, that contains various HTML reports that BamStats creates.

The [CWL standard](http://common-workflow-language.github.io/) is continuing to evolve and hopefully we will see new features, like support for [EDAM ontology](http://edamontology.org/page) terms, in future releases.  In the mean time the [Gitter chat](https://gitter.im/common-workflow-language/common-workflow-language) is an active community to help drive the development of CWL in positive directions and we recommend tool authors make their voices heard.

It is also possible to describe tools via the [WDL language](https://github.com/broadinstitute/wdl). A tool can either be described in WDL-only or can be described with both WDL and CWL.   

A tool can also be described as a one task WDL workflow.

We provide a hello world example as follows:

    task hello {
      String name
    
      command {
        echo 'hello ${name}!'
      }
      output {
        File response = stdout()
      }
    }
    
    workflow test {
      call hello
    }

We are currently monitoring WDL to see how metadata like that provided for CWL will be integrated into WDL.

## Next Steps

Follow the [next tutorial](docs/getting-started-with-dockstore) to register your tool on Dockstore.
