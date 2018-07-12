#!/bin/bash
docker kill rabbitmq
docker rm rabbitmq
docker run -d -p15672:15672 -p5672:5672 --name rabbitmq handsoff/message-queue
