/*
 * The MIT License
 *
 * Copyright (c) 2013, Jan Molak, SmartCode Ltd http://smartcodeltd.co.uk
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package com.smartcodeltd.jenkinsci.plugins.buildmonitor;

import hudson.Extension;
import hudson.Util;
import hudson.model.*;
import hudson.model.Descriptor.FormException;
import hudson.tasks.Builder;
import hudson.tasks.Shell;
import hudson.util.FormValidation;
import jenkins.model.Jenkins;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import org.codehaus.jackson.map.ObjectMapper;
import org.kohsuke.stapler.*;
import org.kohsuke.stapler.bind.JavaScriptMethod;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import static hudson.Util.filter;

/**
 * An exploratory view which is really a REST endpoint thingie.
 * @author Michael Neale
 */
public class BuildMonitorView extends ListView {

    /**
     * This is accessed via: http://localhost:8080/jenkins/view/ttt/createJob?name=yeah
     */
    public HttpResponse doCreateJob(final StaplerRequest req, final @QueryParameter String name) throws IOException {
        return new HttpResponse() {
            @Override
            public void generateResponse(StaplerRequest staplerRequest, StaplerResponse staplerResponse, Object o) throws IOException, ServletException {
                createJobFromTemplate(staplerResponse, name, req);
            }
        };
    }


    /**
     * This is accessed via: http://localhost:8080/jenkins/view/ttt/inspectJobs
     * This will walk the tree of jobs, and do something. Exploring api.
     */
    public HttpResponse doInspectJobs(final StaplerRequest req, final @QueryParameter String job) throws IOException {

        return new HttpResponse() {
            @Override
            public void generateResponse(StaplerRequest staplerRequest, StaplerResponse staplerResponse, Object o) throws IOException, ServletException {
                freeStyleJobFun();
                staplerResponse.getWriter().println("OK look in console");
            }
        };
    }

    private void freeStyleJobFun() {
        for (TopLevelItem it : Jenkins.getInstance().getItems()) {
            if (it instanceof FreeStyleProject) {

                FreeStyleProject p = (FreeStyleProject) it;
                System.err.println(p.getScm());

                for (Builder b: p.getBuilders()) {
                    if (b instanceof Shell) {
                        Shell s = (Shell) b;
                        System.err.println(s.getCommand());
                    }
                }
                if (p.getBuilders().size() == 1) {
                    p.getBuildersList().add(new Shell("# this is another step"));
                }
                System.err.println(p.getDescription());

            }
        }
    }


    private void createJobFromTemplate(StaplerResponse staplerResponse, String name, StaplerRequest req) throws IOException {
        InputStream input = new URL("https://gist.githubusercontent.com/michaelneale/47b9563f66308fc15915/raw/ef6f6e85a478930b198a52baae4f3a760d6c1800/gistfile1.xml").openStream();
        Jenkins.getInstance().createProjectFromXML(name, input);
        staplerResponse.setContentType("text/plain");
        staplerResponse.getWriter().println("OK");
    }


    /* VIEW BOILERPLATE CRAP FOLLOWS */


    /**
     * @param name  Name of the view
     */
    @DataBoundConstructor
    public BuildMonitorView(String name) {
        super(name);
    }

    @Extension
    public static final class Descriptor extends ViewDescriptor {
        public Descriptor() {
            super(BuildMonitorView.class);
        }

        @Override
        public String getDisplayName() {
            return "CloudBees Easy Cloud";
        }

        /**
         * Cut-n-paste from ListView$Descriptor as we cannot inherit from that class
         */
        public FormValidation doCheckIncludeRegex(@QueryParameter String value) {
            String v = Util.fixEmpty(value);
            if (v != null) {
                try {
                    Pattern.compile(v);
                } catch (PatternSyntaxException pse) {
                    return FormValidation.error(pse.getMessage());
                }
            }
            return FormValidation.ok();
        }
    }




}