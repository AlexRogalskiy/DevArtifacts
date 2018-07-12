#!/bin/sh

# Create Rabbitmq user
( sleep 5 ; \
cd /tmp ; \
wget http://localhost:15672/cli/rabbitmqadmin ; \
mv ./rabbitmqadmin /rabbitmqadmin ; \
chmod +x /rabbitmqadmin ; \


rabbitmqctl add_user $RABBITMQ_USER $RABBITMQ_PASSWORD 2>/dev/null ; \
rabbitmqctl set_user_tags $RABBITMQ_USER administrator ; \
rabbitmqctl set_permissions -p / $RABBITMQ_USER  ".*" ".*" ".*" ; \

rabbitmqctl add_user listener listener 2>/dev/null ; \
rabbitmqctl set_user_tags listener administrator ; \
rabbitmqctl set_permissions -p / listener  ".*" ".*" ".*" ; \

rabbitmqctl add_user parser parser 2>/dev/null ; \
rabbitmqctl set_user_tags parser administrator ; \
rabbitmqctl set_permissions -p / parser  ".*" ".*" ".*" ; \

echo "*** User '$RABBITMQ_USER' with password '$RABBITMQ_PASSWORD' completed. ***" ; \
echo "*** Log in the WebUI at port 15672 ***") &

rabbitmq-server $@
