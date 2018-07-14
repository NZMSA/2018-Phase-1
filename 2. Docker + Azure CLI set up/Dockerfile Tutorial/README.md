# 2. Docker set up 
## Introduction

### Docker

Docker is simply a tool which makes it easy for developers to build, deploy and run applications using containers. 
Containers are lightweight images and allows the developers to package the application with everything it needs (libraries and dependencies) to run on the host machine.
This ensures that the application will run on any machine so no more of "it works on my laptop".
Docker builds images automatically by reading the commands specified in the Dockerfile.

Add the Dockerfile and .dockerignore file in the following order:
```text
my-app/
├─ .gitignore
├─ node_modules/
├─ public/
├─ src/
│  └─ ...
├─ package.json
├─ tsconfig.json
└─ tslint.json
Dockerfile
.dockerignore
```
Note: If you're using docker toolbox please run the below commands in the docker toolbox.

Then to build the image run
```shell
docker build -t my-app .
```
To see the image that the dockerfile just made, run (take note of the image ID)
```shell
docker images
```
To run the docker image
```shell
docker run -it -p 3000:3000 -v [path to dockerfile]/my-app/src:/my-app/src [image id]
```
If you navigate to localhost, your app should now be running.

Below is an explanation of the commands written in the dockerfile:

FROM => used to build the base image for the new image

RUN => used to run a command 

WORKDIR => setting the working directory

COPY => copying files TO:FROM

ENV <key> <value> => used to set environment variables

ARG => variable definition
