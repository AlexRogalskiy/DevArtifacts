docker build . -t trackr:rabbitmq
docker run -p15672:15672 --name trackr:rabbitmq trackr:rabbitmq 
