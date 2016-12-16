# Public and Private Dockstore Tools
Most tool creators want public access to their tools, however some might want to restrict access to running the tool.

A `public Dockstore tool` is a tool which does not require authentication to view on the Docker registry's website or to pull the Docker image. It is freely available for anyone to use.

A `private Dockstore tool` is a tool which requires authentication to view on the Docker registry's website (if it exists) and to pull the Docker image. A user interested in using a private tool must select the `Request Access` button and send their username for the Docker registry that the private tool originates from to the tool maintainer to request access. It is then the responsibility of the tool maintainer to give the user permission to view/pull the docker image.

It is important to note that a private tool will still have the descriptor files and tool metadata visible to anyone. It is only that users can't publicly view the Docker image or pull it without authentication.

## Next Steps

Read up on background information on the Dockstore project at [About](/docs/about) page or see our [full list of documentation](/docs).
