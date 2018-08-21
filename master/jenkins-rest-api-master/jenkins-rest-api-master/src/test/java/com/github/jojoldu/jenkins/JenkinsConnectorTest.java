package com.github.jojoldu.jenkins;

import org.junit.Test;

/**
 * Created by jojoldu@gmail.com on 2017. 7. 24.
 * Blog : http://jojoldu.tistory.com
 * Github : https://github.com/jojoldu
 */

public class JenkinsConnectorTest {

    private static final String HOST = "http://localhost:32769";
    private static final String JOB = "springboot";
    private static final String USERNAME = "jojoldu";
    private static final String TOKEN = "f9e44cbd1096b4cf6de95216de70363a";

    @Test
    public void 로컬젠킨스_JOB_실행() throws Exception {
        RequestEntity requestEntity = new RequestEntity(HOST, JOB, USERNAME, TOKEN);
        JenkinsConnector jenkinsConnector = new JenkinsConnector();

        jenkinsConnector.executeJob(requestEntity);
    }

    @Test
    public void 로컬젠킨스_JOB_실행_파라미터포함() throws Exception {
        RequestEntity requestEntity = new RequestEntity(HOST, JOB, USERNAME, TOKEN);
        requestEntity.add(new NameValue("name", "jojoldu"));
        requestEntity.add(new NameValue("email", "jojoldu@gmail.com"));

        JenkinsConnector jenkinsConnector = new JenkinsConnector();

        jenkinsConnector.executeJob(requestEntity);
    }
}
