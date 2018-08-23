package com.mkyong.test;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
@ComponentScan({ "com.mkyong.*" })
public class AppConfig {

	/*private static final Logger log = LoggerFactory.getLogger(AppConfig.class);
	
	@Bean
	@Profile("dev")
    public CacheManager concurrentMapCacheManager() {
		log.debug("Cache manager is concurrentMapCacheManager");
        return new ConcurrentMapCacheManager("movieFindCache");
    }
	
	@Bean
	@Profile("live")
	public CacheManager cacheManager() {
		log.debug("Cache manager is ehCacheCacheManager");
		return new EhCacheCacheManager(ehCacheCacheManager().getObject());
	}

	@Bean
	@Profile("live")
	public EhCacheManagerFactoryBean ehCacheCacheManager() {
		EhCacheManagerFactoryBean cmfb = new EhCacheManagerFactoryBean();
		cmfb.setConfigLocation(new ClassPathResource("ehcache.xml"));
		cmfb.setShared(true);
		return cmfb;
	}*/
	
}