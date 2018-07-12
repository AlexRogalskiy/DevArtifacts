FROM rabbitmq:3-management

ADD init.sh init.sh

ENV RABBITMQ_USER user
ENV RABBITMQ_PASSWORD user

EXPOSE 15672

CMD ["/init.sh"]
