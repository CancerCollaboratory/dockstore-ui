# Getting Started

In this guide we will start with creating a simple Docker-based tool, sharing it through the Dockstore, and calling the container yourself to process some sample data.

## Sign Up for Accounts

Dockstore is powered by [Quay.io](https://quay.io/) and [Docker Hub](https://hub.docker.com/), for storing Docker images, and [GitHub](https://github.com/) and [Bitbucket](https://bitbucket.org/) for storing the build file (`Dockerfile`) and metadata descriptor file (`Dockstore.cwl or Dockstore.wdl`) that are used by this site.  Since the Dockstore does not permanently store your Docker images, your Dockerfile, or your Dockstore.cwl metadata file, you are free to use all the excellent features of Quay.io/Docker Hub and GitHub/Bitbucket.  If you are already using these services then you will appreciate the fact that registering your Docker images on Dockstore is extremely easy and requires very little interruption to the way you work already.  For those of you that use [Docker Hub](https://hub.docker.com/), an extremely popular Docker registry, we are planning on adding enhanced support for features in the near future.  For now, we recommend users of Dockstore sign up for both Quay.io and GitHub/Bitbucket accounts to host their Docker images and build/metadata files respectively.  Partial support for Docker Hub is available, but it requires manual entry of image and tag data on Dockstore. If you are already building your Docker images on Docker Hub automatically it takes just minutes to setup a comparable build on Quay.io.

* [Sign up for an account on GitHub...](https://github.com/) (Required for authentication.)
* [Sign up for an account on Bitbucket...](https://bitbucket.org/) (Optional)
* [Sign up for an account on Quay.io...](https://quay.io/) (Recommended)
* [Sign up for an account on Docker Hub...](https://hub.docker.com/) (Optional if you've established a quay.io account)

## Tool Development Environment 

When going through the onboarding wizard, our various dependencies were introduced. Verify that they are properly installed by opening a terminal and executing the following. You should see very similar output. If there are errors make sure you follow the setup instructions carefully:

    $> java -version
    java version "1.8.0_91"
    Java(TM) SE Runtime Environment (build 1.8.0_91-b14)
    Java HotSpot(TM) 64-Bit Server VM (build 25.91-b14, mixed mode)

    $> docker --version
    Docker version 1.11.1, build 5604cbe

    $> cwltool --version
    /usr/local/bin/cwltool 1.0.20160712154127

    $> dockstore --version
    Dockstore version 0.4-beta.5
    You are running the latest stable version...
    ...
    
In addition to the tools mentioned above you will probably want a editor capable of syntax highlighting Dockerfiles such as [Atom](https://atom.io/).

## Create Your Tool

Docker is a fantastic tool for creating light-weight containers to run your tools.  What this means is it gives you a fast VM-like environment for Linux where you can automatically install dependencies, make configurations, and setup your tool exactly the way you want, as you would on a "normal" Linux host.  You can then quickly and easily share these Docker images with the world using registries like Docker Hub and Quay.io (indexed by Dockstore).  The full details on how to make new Docker images is beyond the scope of this site but the first place to look is in the excellent documentation on Docker's site.  See Docker's [documentation](https://docs.docker.com/), which will walk you through installing Docker on your computer and making your own images.  The goal is to create a Dockerfile for your tool, stored in a supported Git repository.  The steps, at a high level, are:

0. create a new repository on GitHub or Bitbucket
0. create a `Dockerfile` in that repository that conforms to that described in the guide above
0. use the Docker tools to build and test your Docker image
0. use the release process on GitHub or Bitbucket to make distinct release tags, we like the [HubFlow](https://datasift.github.io/gitflow/) process in our group for managing releases in git
0. setup Quay.io to automatically build your Docker image or manually register public images if you are using Docker Hub

For an example, see the [dockstore-tool-bamstats](https://github.com/briandoconnor/dockstore-tool-bamstats) repository on GitHub which we created as an example.

For the rest of this tutorial, you may wish to work in your own repository with your own tool or "fork" the repository above into your own GitHub account. 

With a repository established in GitHub, the next step is to create the Docker image
with BAMStats correctly installed.  You need to create a `Dockerfile`, this contains
the instructions necessary for creating a Docker image that contains all the
dependencies of BAMStats along with the executable itself.

# Creating a Dockerfile

Here's my sample [Dockerfile](https://github.com/briandoconnor/dockstore-tool-bamstats/blob/develop/Dockerfile):

```Dockerfile
#############################################################
# Dockerfile to build a sample tool container for BAMStats
#############################################################

# Set the base image to Ubuntu
FROM ubuntu:14.04

# File Author / Maintainer
MAINTAINER Brian OConnor <briandoconnor@gmail.com>

# Setup packages
USER root
RUN apt-get -m update && apt-get install -y wget unzip openjdk-7-jre zip

# get the tool and install it in /usr/local/bin
RUN wget -q http://downloads.sourceforge.net/project/bamstats/BAMStats-1.25.zip
RUN unzip BAMStats-1.25.zip && \
    rm BAMStats-1.25.zip && \
    mv BAMStats-1.25 /opt/
COPY bin/bamstats /usr/local/bin/
RUN chmod a+x /usr/local/bin/bamstats

# switch back to the ubuntu user so this tool (and the files written) are not owned by root
RUN groupadd -r -g 1000 ubuntu && useradd -r -g ubuntu -u 1000 ubuntu
USER ubuntu

# by default /bin/bash is executed
CMD ["/bin/bash"]
```

This Dockerfile has a lot going on in it.  There are good tutorials online
about the details of Dockerfile and its syntax.  An excellent resource is the
Docker website itself, including the [Best practices for writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)
webpage.  I'll highlight some sections below:

```Dockerfile
FROM ubuntu:14.04
```

This uses the ubuntu 14.04 base distribution.  How do I know to use `ubuntu:14.04`?  This comes from either a
search on Ubuntu's home page for their "official" Docker images or you can simply go to [DockerHub](http://hub.docker.com)
or [Quay](http://quay.io) and search for whatever base image you like.  You can extend anything you find there
so if you come across an image that contains most of what you want you can use it as the base here.  Just be
aware of its source, I tend to stick with "official", basic images for security reasons.

```Dockerfile
MAINTAINER Brian OConnor <briandoconnor@gmail.com>
```
You should include your name and contact information.

```Dockerfile
USER root
RUN apt-get -m update && apt-get install -y wget unzip openjdk-7-jre zip
RUN wget -q http://downloads.sourceforge.net/project/bamstats/BAMStats-1.25.zip
RUN unzip BAMStats-1.25.zip && \
    rm BAMStats-1.25.zip && \
    mv BAMStats-1.25 /opt/
```
This switches to the `root` user to perform software installs. It downloads
BAMStats, unzips it, and installs it in the correct location, here it's
`/opt`.

**This is why Docker is so powerful.**  On HPC systems the above process might take days or
weeks of working with a sys admin to install dependencies on all compute nodes.  Here
I can control and install whatever I like inside my Docker image, correctly configuring
the environment for my tool and avoiding the time to setup these dependencies in
the places I want to run.  This greatly simplifies the install process for other users
that you share your tool with as well.

```Dockerfile
COPY bin/bamstats /usr/local/bin/
RUN chmod a+x /usr/local/bin/bamstats
```
This copies the local helper script `bamstats` from the git checkout directory
to `/usr/local/bin`.  This is an important example, it shows how to use `COPY`
to copy files in the git directory structure to inside the Docker image.
After copying to `/usr/local/bin` the script is made runnable by all users.

```Dockerfile
RUN groupadd -r -g 1000 ubuntu && useradd -r -g ubuntu -u 1000 ubuntu
USER ubuntu

# by default /bin/bash is executed
CMD ["/bin/bash"]
```
The user `ubuntu` is created and switched to in order to make file ownership easier and the default
command for this Docker image is set to `/bin/bash` which is a typical default.  

An important thing to note, this `Dockerfile` just really scratches the surface.  Take a look at
[Best practices for writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/)
for a really terrific in-depth look at writing Dockerfiles.


Read more on the development process at [https://docs.docker.com...](https://docs.docker.com/). For information on building your Docker image on Quay.io we recommend their [tutorial](https://quay.io/tutorial/).


## Next Steps

Follow the [next tutorial](docs/getting-started-with-cwl) to describe your tool with CWL.
