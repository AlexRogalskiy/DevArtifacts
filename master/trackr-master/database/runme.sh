#!/bin/bash
docker kill mongo
docker rm mongo
docker run -d -p27017:27017 --name mongo -d mongo
