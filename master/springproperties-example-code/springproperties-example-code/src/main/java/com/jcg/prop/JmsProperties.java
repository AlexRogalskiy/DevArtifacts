package com.jcg.prop;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author ashraf
 *
 */
@Component
public class JmsProperties {

	@Value("${jms.factory.initial}")
	private String factoryInitial;

	@Value("${jms.provider.url}")
	private String providerUrl;

	@Value("${jms.queue}")
	private String queue;

	public String getFactoryInitial() {
		return factoryInitial;
	}

	public String getProviderUrl() {
		return providerUrl;
	}

	public String getQueue() {
		return queue;
	}

	@Override
	public String toString() {
		return "JmsProperties [factoryInitial=" + factoryInitial
				+ ", providerUrl=" + providerUrl + ", queue=" + queue + "]";
	}
	
}
