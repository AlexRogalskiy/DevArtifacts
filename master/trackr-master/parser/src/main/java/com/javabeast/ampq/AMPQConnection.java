package com.javabeast.ampq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by jeffreya on 05/11/2016.
 */

@Configuration
@EnableRabbit
public class AMPQConnection {

    @Value("${trackr.exchange}")
    private String exchange;

    @Value("${trackr.unprocessed.queue}")
    private String unprocessedQueue;

    @Value("${number.of.consumers}")
    private String numberOfConsumers;

    @Value("${number.of.consumers.max}")
    private String maxNumberOfConsumers;

    @Bean
    Queue queue() {
        return new Queue(unprocessedQueue, false);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(exchange);
    }

    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(unprocessedQueue);
    }

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setConcurrentConsumers(Integer.parseInt(numberOfConsumers));
        factory.setMaxConcurrentConsumers(Integer.parseInt(maxNumberOfConsumers));
        factory.setAcknowledgeMode(AcknowledgeMode.MANUAL);
        return factory;
    }


}
