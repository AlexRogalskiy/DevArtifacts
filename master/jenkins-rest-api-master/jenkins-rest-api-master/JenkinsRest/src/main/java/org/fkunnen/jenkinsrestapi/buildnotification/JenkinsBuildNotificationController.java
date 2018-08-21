package org.fkunnen.jenkinsrestapi.buildnotification;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class JenkinsBuildNotificationController {


    @RequestMapping(value = "/jenkins/buildnotification", method = POST)
    public void JenkinsJobBuildNotification(@RequestBody BuildNotificationInfo buildNotificationInfo){
        try {
            Files.write(
                    Paths.get("src/main/resources/notifications_received.txt"),
                    buildNotificationInfo.toString().getBytes(),
                    StandardOpenOption.TRUNCATE_EXISTING
            );
        }catch (IOException e) {
            //exception handling left as an exercise for the reader
        }
    }

}
