# Docker Registries

There are a lot of Docker Registries now besides Docker Hub and Quay.io. These registries are a combination of public registries and private registries.

## Public vs Private Docker Registries

A `public registry` is a Docker registry where Docker images are available to all users through a public website. They may also include private images, though this is not mandatory. Docker Hub is a good example of a public registry. You can browse a list of public Docker images, and also store and view private Docker images.

We currently support the following public registries:
* Docker Hub
* Quay.io
* GitLab

A `private registry` is a Docker registry where access to Docker images are restricted to authenticated users. These registries do not have public websites to view the Docker images. Amazon ECR is a good example of a private registry. These registries are useful when you want to restrict access of a tool to authorized users only.

We currently support the following private registries:
* Amazon ECR

## Private Docker Registry Best Practices

### Private tools only

One thing to note is that all Dockstore tool entries that reference an image from a private Docker registry must be set as private. At registration, you will have to set the tool as private or else you will not be able to register it.

This is because private Docker registry images require authorization to access, so they have to be specified as private. For a user to gain access, they will have to select the request access button on the Dockstore tool page and give the username they have for the given Docker registry. Then it will be the responsibility of the tool maintainer to add the user to have pull access to the Docker image.

### Amazon ECR tools

Amazon ECR images have an associated file containing the `Repository Policies`. When a tool user requests access to an Amazon ECR image, the tool maintainer should add them to the list of users with pull access.

More information can be found on the [Amazon ECR](http://docs.aws.amazon.com/AmazonECR/latest/userguide/RepositoryPolicyExamples.html#IAM_allow_other_accounts) page.

## Docker Registry Request

If you would like to request support for a registry that is not currently supported, then please create an issue on our [Github](https://github.com/ga4gh/dockstore/issues) page.