package com.ubs.network.api.rest.core.configuration;

import com.ubs.network.api.rest.common.configuration.BaseConfiguration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

public class LocalConfiguration extends BaseConfiguration {

    @Bean
    public RestTemplate restTemplate(final RestTemplateBuilder builder) {
        return builder.build();
    }
}
