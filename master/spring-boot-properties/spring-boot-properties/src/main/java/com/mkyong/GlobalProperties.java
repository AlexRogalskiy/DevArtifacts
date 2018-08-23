package com.mkyong;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Component
//@PropertySource("classpath:global1.properties")
@ConfigurationProperties
public class GlobalProperties {

    //@Value("${thread-pool}")
    @Max(5)
    @Min(0)
    private int threadPool;

    //@Value("${email}")
    @NotEmpty
    private String email;

    public int getThreadPool() {
        return threadPool;
    }

    public void setThreadPool(int threadPool) {
        this.threadPool = threadPool;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public String toString() {
        return "GlobalProperties{" +
                "threadPool=" + threadPool +
                ", email='" + email + '\'' +
                '}';
    }
}
