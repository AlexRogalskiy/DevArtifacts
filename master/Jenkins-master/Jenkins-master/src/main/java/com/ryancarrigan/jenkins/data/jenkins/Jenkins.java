package com.ryancarrigan.jenkins.data.jenkins;

import com.ryancarrigan.jenkins.data.jenkins.home.Home;
import com.ryancarrigan.jenkins.download.FileDownloader;

/**
 * com.ryancarrigan.jenkins.data.jenkins
 *
 * @author Ryan P. Carrigan
 * @since 6/10/14.
 */
public class Jenkins extends Home {

    public Jenkins(final String serverUrl) {
        super(new FileDownloader(serverUrl).getDocument());
    }
}
