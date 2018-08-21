package org.jenkins.plugins.jenkinsrest;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;
import hudson.Extension;
import hudson.ExtensionPoint;
import hudson.model.AbstractDescribableImpl;
import hudson.model.Descriptor;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.kohsuke.stapler.DataBoundConstructor;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.logging.Logger;

/**
 * Created by tsutsumi on 11/8/14.
 */
public class RestNotifier extends AbstractDescribableImpl<RestNotifier> implements ExtensionPoint {

    protected static final MustacheFactory mustacheFactory = new DefaultMustacheFactory();
    protected static final HttpClient httpclient = new DefaultHttpClient();
    protected static final Logger LOG = Logger.getLogger(RestNotifier.class.getName());

    public String urlTemplate;
    protected Mustache _compiledTemplate;

    @DataBoundConstructor
    public RestNotifier(String _urlTemplate) {
        urlTemplate = _urlTemplate;
    }

    public void notify(Event event) {
        String url = renderURL(event);
        try {
            HttpGet request = new HttpGet(url);
            httpclient.execute(request);
            request.releaseConnection();
        } catch (IOException e) {
            LOG.warning("There was an error sending a notification: " + e.toString());
        }
    }

    public String renderURL(Event event) {
        HashMap<String, Object> parameters = new HashMap<String, Object>(event.attributes);
        parameters.put("eventType", event.eventType.name);

        Mustache compiledTemplate = getCompiledTemplate();
        StringWriter stringWriter = new StringWriter();
        compiledTemplate.execute(stringWriter, parameters);

        return stringWriter.toString();
    }

    public Mustache getCompiledTemplate() {
        if (_compiledTemplate == null) {
            _compiledTemplate = mustacheFactory.compile(urlTemplate);
        }
        return _compiledTemplate;
    }

    @Extension
    public static class DescriptorImpl extends Descriptor<RestNotifier> {

        @Override
        public String getDisplayName() {
            return "RestNotifier";
        }
    }
}
