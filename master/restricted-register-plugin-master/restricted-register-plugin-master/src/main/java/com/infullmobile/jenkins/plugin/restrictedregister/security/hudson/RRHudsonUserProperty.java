package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson;

import com.infullmobile.jenkins.plugin.restrictedregister.settings.PluginGlobalConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.util.Utils;
import hudson.Extension;
import hudson.model.User;
import hudson.model.UserProperty;
import hudson.model.UserPropertyDescriptor;
import jenkins.model.GlobalConfiguration;
import org.apache.commons.lang.StringUtils;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.DataBoundSetter;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Adam Kobus on 30.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class RRHudsonUserProperty extends UserProperty {

    private String activationCode;
    private boolean activated;
    private String activatedAt;
    private String ruleName;

    @SuppressWarnings("WeakerAccess")
    @DataBoundConstructor
    public RRHudsonUserProperty() {

    }

    public String getActivationCode() {
        return activationCode;
    }

    @DataBoundSetter
    public void setActivationCode(String activationCode) {
        this.activationCode = activationCode;
    }

    public boolean getActivated() {
        return activated;
    }

    @DataBoundSetter
    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public String getActivatedAt() {
        return activatedAt;
    }

    @DataBoundSetter
    public void setActivatedAt(String activatedAt) {
        this.activatedAt = activatedAt;
    }

    public String getRuleName() {
        return ruleName;
    }

    @DataBoundSetter
    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public static boolean isUserActivated(@Nonnull User user) {
        final RRHudsonUserProperty userProperty = user.getProperty(RRHudsonUserProperty.class);
        return userProperty != null && userProperty.getActivated();
    }

    public static void setUserActivated(@Nonnull User user) throws IOException {
        final RRHudsonUserProperty userProperty = user.getProperty(RRHudsonUserProperty.class);
        userProperty.setActivated(true);
        userProperty.setActivatedAt(Utils.getFormattedTimestamp(new Date()));
        user.addProperty(userProperty);
    }

    @Nullable
    public static User getUserForActivationCode(@Nullable String activationCode) {
        if (StringUtils.isEmpty(activationCode)) {
            return null;
        }
        return getUserForCode(activationCode);
    }

    @Nullable
    private static User getUserForCode(@Nonnull String activationCode) {
        final List<User> allUsers = new ArrayList<>(User.getAll());
        for (User user : allUsers) {
            final RRHudsonUserProperty userProperty = user.getProperty(RRHudsonUserProperty.class);
            if (userProperty != null && activationCode.equals(userProperty.getActivationCode())) {
                return user;
            }
        }
        return null;
    }

    @Nullable
    public static String getActivationCodeForUser(User user) {
        final RRHudsonUserProperty hudsonUserProperty = getPropertyForUser(user);
        if (hudsonUserProperty == null) {
            return null;
        }
        return hudsonUserProperty.getActivationCode();
    }

    @Nonnull
    public static RRHudsonUserProperty obtainPropertyForUser(User user) {
        RRHudsonUserProperty ret = getPropertyForUser(user);
        if (ret == null) {
            ret = new RRHudsonUserProperty();
        }
        return ret;
    }

    @Nullable
    public static RRHudsonUserProperty getPropertyForUser(@Nullable User user) {
        if (user == null) {
            return null;
        }
        return user.getProperty(RRHudsonUserProperty.class);
    }

    @Extension
    public static class RRUserPropertyDescriptor extends UserPropertyDescriptor {

        @Override
        public UserProperty newInstance(User user) {
            return new RRHudsonUserProperty();
        }

        @Nonnull
        @Override
        public String getDisplayName() {
            return "Restricted Registration";
        }

        @Override
        public boolean isEnabled() {
            return GlobalConfiguration.all().get(PluginGlobalConfig.class).getEnabled() &&
                    HudsonSecurityRealmRegistration.isActive();
        }
    }
}
