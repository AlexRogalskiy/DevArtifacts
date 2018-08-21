package com.ryancarrigan.jenkins.data.reporter;

import com.ryancarrigan.jenkins.data.jenkins.build.Build;
import com.ryancarrigan.jenkins.download.FileDownloader;
import org.jdom2.Document;

/**
 * com.ryancarrigan.jenkins.data.reporter
 *
 * @author Ryan P. Carrigan
 * @since 6/1/14.
 */
public class BuildReporter {

    public BuildReporter(final String buildUrl) {
        final Document document = new FileDownloader(buildUrl).getDocument();
        final Build build = new Build(document);
    }

}
