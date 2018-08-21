package com.infullmobile.jenkins.plugin.restrictedregister.util;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.utils.Messages;
import org.apache.commons.lang.StringUtils;
import org.apache.http.client.utils.URIBuilder;

import javax.annotation.Nonnull;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class AppUrls {

    private static final String FORMAT_REGISTER_PATH = "/%s/";
    private static final String FORMAT_LOGIN_PATH = "/%s";

    private AppUrls() {

    }

    @Nonnull
    public static String buildSignInUrl() throws InvalidUriException {
        String ret = null;
        final String path = String.format(Locale.US, FORMAT_LOGIN_PATH,
                PluginModule.getDefault().getJenkinsDescriptor().getLoginURI());
        try {
            final URIBuilder builder = new URIBuilder(getRootURL());
            builder.setPath(path);
            final URI uri = builder.build();
            ret = uri.toURL().toExternalForm();
        } catch (URISyntaxException | MalformedURLException e) {
            onError(e.getLocalizedMessage());
        }
        return ret;
    }

    @Nonnull
    public static String buildActivationUrl(String code, String secret) throws InvalidUriException {
        String ret = null;
        final String path = String.format(Locale.US, FORMAT_REGISTER_PATH,
                PluginModule.getDefault().getPluginDescriptor().getRootActionURL());
        try {
            final URIBuilder builder = new URIBuilder(getRootURL());
            builder.setPath(path);
            builder.addParameter(BaseFormField.SECRET.getFieldName(), secret);
            builder.addParameter(BaseFormField.ACTIVATION_CODE.getFieldName(), code);
            final URI uri = builder.build();
            ret = uri.toURL().toExternalForm();
        } catch (URISyntaxException | MalformedURLException e) {
            onError(e.getLocalizedMessage());
        }
        return ret;
    }

    private static String getRootURL() throws InvalidUriException {
        final String ret = PluginModule.getDefault().getJenkinsDescriptor().getRootURL();
        if (StringUtils.isEmpty(ret)) {
            onError(Messages.RRUrlError_EmptyJenkinsURL());
        }
        return ret;
    }

    private static void onError(String message) throws InvalidUriException {
        throw new InvalidUriException(message);
    }
}
