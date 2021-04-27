# userlists

Antartica global test

This project is made using Loopback 4 and mongoDB

# https://loopback.io/doc/en/lb4/Getting-started.html

Download and install Loopback 4 and mongoDB.

# about micro service

Joi validations are added to validate request Body of APIs.

Global interceptor is also added validate apikey or auth token.

Docker file is also added.

# docker container

- To create an image with no cache
  sudo docker build -t members --no-cache .

- To list all images
  sudo docker images

- To create a container:
  sudo docker run -d -p <custom port>:<exposed port> <imagename>:<tag>​

- To list all running containers:
  sudo docker ps

- To see container logs:
  sudo docker logs <container-id>
