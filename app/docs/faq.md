# FAQ (Frequently Asked Questions)

## How does launching with Dockstore CLI compare with cwltool?

The Dockstore CLI has utilities to generate JSON parameter files from entries on Dockstore (`dockstore tool convert`). 

When launching tools, the Dockstore CLI makes it easy to specify entries from Dockstore.
We can also provision input and output files from and to HTTP, ftp, and S3. We also have preliminary support for [Synapse](https://www.synapse.org/) and the [ICGC Storage client](http://docs.icgc.org/cloud/guide/#storage-client-usage), please contact us to get more information on these two file transfer sources. 

## What environment do you test tools in?
 
Typically, we test running tools in Ubuntu Linux 14.04 LTS and 16.04 LTS on VMs in [OpenStack](https://www.openstack.org/) with 8 vCPUs and 96 GB of RAM and above. If you are only listing and editing tools, we have achieved success with much lower system requirements. However, launching tools will have higher system requirements dependent on the specific tool. Consult a tool's README when in doubt.  
 
## There are too many versions of my tool, how do I delete some?

Versions of your tool for most tools are harvested from the list of Tags for an image on quay.io, [as an example](https://quay.io/repository/pancancer/pcawg-bwa-mem-workflow?tab=tags). If you have the right permissions, you can delete some and then refresh a tool on Dockstore to clean-up. 

## Do you have tips on creating Dockerfiles?

* make sure you [set up Docker command](https://docs.docker.com/engine/installation/linux/ubuntulinux/#/create-a-docker-group) on your system so you do not need sudo
* do not call Docker-inside-Docker (it's possible but causes Docker client/server issues, it is also not compatible with CWL) 
* do not depend on changes to `hostname` or `/etc/hosts`, Docker will interfere with this
* try to keep your Docker images small

## Do you have tips on creating CWL files?

When writing CWL tools and workflows, there are a few common workarounds that can be used to deal with the restrictions that CWL places on the use of docker. These include:
* cwltool (which we use to run tools) is restrictive and locks down much of `/` as read only, use the current working directory or $TMPDIR for file writes
  * You can also use [Docker volumes](https://docs.docker.com/engine/reference/builder/#/volume) in your Dockerfile to specify additional writeable directories
* Do not rely on the hostname inside a container, Docker dynamically generates this when starting containers

Additionally:

* you need to "collect" output from your tools/workflows inside docker and drop them into the current working directory in order for CWL to "find" them and pull them back outside of the container
* related to this, it's often times easiest to write a simple wrapper script that maps the command line arguments specified by CWL to however your tool expects to be parameterized. This script can handle moving output to the current working directory and renaming if need be
* genomics workflows work with large data files, this can have a few ramifications:
    * do not "package" large data reference files in your Docker image.  Instead, treat them as "inputs" so they can be stagged outside and mounted into the running container
    * the `$TMPDIR` variable can be used as a scratch space inside your container.  Make sure your host running Docker has sufficient scratch space for processing your genomics data.
    
## Any last tips on using Dockstore?

* the Dockstore CLI uses `./datastore` for temp files so if you're processing large files make sure this partition hosting the current directory is large.
* you can use a single Docker image with multiple tools, each of them registered via a different CWL
* you can use a Git repository with multiple CWL files
* related to the two above, you can use non-standard file paths if you customize your registrations in the Version tab of Dockstore
