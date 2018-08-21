package org.jenkinsci.plugins.jira_rest;
import hudson.Extension;
import hudson.Launcher;
import hudson.model.BuildListener;
import hudson.model.Item;
import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.Builder;
import hudson.util.FormValidation;

import java.io.IOException;
import java.io.PrintStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import javax.servlet.ServletException;

import net.sf.json.JSONObject;

import org.acegisecurity.Authentication;
import org.apache.commons.validator.routines.UrlValidator;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.QueryParameter;
import org.kohsuke.stapler.StaplerRequest;

import com.cloudbees.plugins.credentials.CredentialsProvider;
import com.cloudbees.plugins.credentials.common.UsernamePasswordCredentials;
import com.cloudbees.plugins.credentials.domains.DomainRequirement;
import com.cloudbees.plugins.credentials.domains.HostnameRequirement;


/**
 * Builder to connect to and interact with a JIRA instance using its REST API.
 */
public class JiraRestBuilder extends Builder {

    private final String jiraUrl;
    private final String jiraUsername;
    private final String jiraPassword;

    // Fields in config.jelly must match the parameter names in the "DataBoundConstructor"
    @DataBoundConstructor
    public JiraRestBuilder(String jiraUrl, String jiraUsername, String jiraPassword) {
        this.jiraUrl = jiraUrl;
		this.jiraUsername = jiraUsername;
		this.jiraPassword = jiraPassword;
    }

    public String getJiraUrl() {
        return jiraUrl;
    }
    
    public String getJiraUsername() {
    	return jiraUsername;
    }
    
    public String getJiraPassword() {
    	return jiraPassword;
    }
    
    private UsernamePasswordCredentials lookupCredentials(PrintStream logger) {
    	try {
	    	final URI uri = new URI(jiraUrl);
	        final String jiraDomain = uri.getHost();
	        System.out.println("extracted hostname is " + jiraDomain);
			final DomainRequirement hostnameRequirement = new HostnameRequirement(jiraDomain);
			
			final List<UsernamePasswordCredentials> credentials = CredentialsProvider
					.lookupCredentials(UsernamePasswordCredentials.class, (Item)null, (Authentication)null, hostnameRequirement);
			
			if (!credentials.isEmpty()) {
				return credentials.get(0);
			} else {
				return null;
			}

    	} catch (final URISyntaxException e) {
    		throw new RuntimeException("Could not extract hostname from url \"" + jiraUrl + "\"", e);
		}
    }
    
    @Override
    public boolean perform(AbstractBuild<?, ?> build, Launcher launcher, BuildListener listener) {
 
    	listener.getLogger().println("Connecting to JIRA instance at " + jiraUrl + "...");
    	
    	final UsernamePasswordCredentials jiraCredentials = lookupCredentials(listener.getLogger());
    	if (jiraCredentials == null) {
    		listener.getLogger().println("No registered credentials found for JIRA url " + jiraUrl);
    		return false;
    	}
    	
    	listener.getLogger().println(" Using JIRA credentials: " + jiraCredentials.getUsername());
    	
    	return true;
    }

	/**
     * Descriptor for {@link JiraRestBuilder}. Used as a singleton.
     * The class is marked as public so that it can be accessed from views.
     */
    @Extension // This indicates to Jenkins that this is an implementation of an extension point.
    public static final class DescriptorImpl extends BuildStepDescriptor<Builder> {

        /**
         * In order to load the persisted global configuration, you have to 
         * call load() in the constructor.
         */
        public DescriptorImpl() {
            load();
        }

        /**
         * Performs on-the-fly validation of the form field 'jiraUrl'.
         *
         * @param value
         *      This parameter receives the value that the user has typed.
         * @return
         *      Indicates the outcome of the validation. This is sent to the browser.
         */
        public FormValidation doCheckJiraUrl(@QueryParameter String value)
                throws IOException, ServletException {

        	final String[] schemes = {"http","https"};
        	final UrlValidator urlValidator = new UrlValidator(schemes);
        	
        	if (!urlValidator.isValid(value)) {
        		return FormValidation.error("Please enter a valid url.");
        	}
 
        	return FormValidation.ok();
        }
        
        /**
         * Performs on-the-fly validation of the form field 'jiraUsername'.
         */
        public FormValidation doCheckJiraUsername(@QueryParameter String value)
                throws IOException, ServletException {
        	if (value.length() == 0) {
        		return FormValidation.error("Please enter a username.");
        	}
             return FormValidation.ok();
        }

        /**
         * Performs on-the-fly validation of the form field 'jiraPassword'.
         */
        public FormValidation doCheckJiraPassword(@QueryParameter String value)
                throws IOException, ServletException {
        	if (value.length() == 0) {
        		return FormValidation.error("Please enter a password.");
        	}
             return FormValidation.ok();
        }
        
        public boolean isApplicable(Class<? extends AbstractProject> aClass) {
            // Indicates that this builder can be used with all kinds of project types 
            return true;
        }

        /**
         * This human readable name is used in the configuration screen.
         */
        public String getDisplayName() {
            return "Interact with JIRA (REST API)";
        }

        @Override
        public boolean configure(StaplerRequest req, JSONObject formData) throws FormException {
            save();
            return super.configure(req,formData);
        }

    }
}

