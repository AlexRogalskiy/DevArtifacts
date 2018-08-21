package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson;

import com.infullmobile.jenkins.plugin.restrictedregister.API;
import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.RegistrationException;
import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.form.IFormValidator;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.Mail;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.MailException;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.data.LocalVariables;
import com.infullmobile.jenkins.plugin.restrictedregister.security.InvalidSecurityRealmException;
import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form.ActivateFormFieldsValidator;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form.ActivationCodeFormValidator;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form.ExistingUserFormValidator;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form.HudsonFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form.RegisterFormFieldsValidator;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.mail.AdminNotificationEmail;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.mail.ConfirmationEmail;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.mail.WelcomeEmail;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.RegistrationRulesSet;
import com.infullmobile.jenkins.plugin.restrictedregister.util.AuthCodeGenerator;
import com.infullmobile.jenkins.plugin.restrictedregister.util.SecretKeyChecker;
import com.infullmobile.jenkins.plugin.restrictedregister.util.Utils;
import hudson.Extension;
import hudson.model.Describable;
import hudson.model.Descriptor;
import hudson.model.User;
import hudson.security.HudsonPrivateSecurityRealm;
import hudson.security.SecurityRealm;
import hudson.tasks.Mailer;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.kohsuke.stapler.Stapler;
import org.kohsuke.stapler.StaplerRequest;
import org.kohsuke.stapler.bind.JavaScriptMethod;

import javax.annotation.Nonnull;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Adam Kobus on 27.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
@Extension
public class HudsonSecurityRealmRegistration extends SecurityRealmRegistration<HudsonPrivateSecurityRealm>
        implements Describable<HudsonSecurityRealmRegistration> {

    private final List<IFormValidator<HudsonSecurityRealmRegistration>> registerFormValidators = new ArrayList<>();
    private final List<IFormValidator<HudsonSecurityRealmRegistration>> activateFormValidators = new ArrayList<>();

    public HudsonSecurityRealmRegistration() {
        registerFormValidators.add(new ExistingUserFormValidator());
        registerFormValidators.add(new RegisterFormFieldsValidator());

        activateFormValidators.add(new ActivateFormFieldsValidator());
        activateFormValidators.add(new ActivationCodeFormValidator());
    }

    static boolean isActive() {
        return HudsonPrivateSecurityRealm.class.isInstance(PluginModule.getDefault().getJenkinsDescriptor()
                .getSecurityRealm());
    }

    // SecurityRealmRegistration<HudsonPrivateSecurityRealm> contract

    @Override
    public boolean isRegistrationForSecurityRealm(SecurityRealm realm) {
        return HudsonPrivateSecurityRealm.class.isInstance(realm);
    }

    // endpoints

    @SuppressWarnings("unused")
    @JavaScriptMethod
    public JSONObject register(JSONObject payload) {
        JSONObject ret;
        try {
            try {
                validateRegisterFormData(payload);
                final RegistrationRulesSet matchingRules = findMatchingConfigRules(payload);
                if (matchingRules == null) {
                    throw new RegistrationException(Messages.RRError_NoMatchingRules());
                }
                initiateAccount(payload, matchingRules);
                ret = API.success();
            } catch (JSONException e) {
                Utils.logError(e);
                throw new RegistrationException(Messages.RRError_Hudson_InvalidEntity());
            }
        } catch (InvalidSecurityRealmException e) {
            ret = API.errorWithMessage(Messages.RRError_SecurityRealmNotApplicable());
        } catch (Exception e) {
            ret = API.errorWithException(e);
            Utils.logError(e);
        }
        return ret;
    }

    private void initiateAccount(JSONObject payload, RegistrationRulesSet matchingRules) throws RegistrationException {
        final User user = User.get(payload.getString(BaseFormField.USERNAME.getFieldName()));
        final RRHudsonUserProperty property = RRHudsonUserProperty.obtainPropertyForUser(user);
        if (property.getActivated()) {
            throw new RegistrationException(Messages.RRError_Hudson_UserIsActivated());
        }
        if (StringUtils.isEmpty(property.getActivationCode())) {
            property.setActivationCode(getNewUniqueAuthCode());
        }
        property.setRuleName(matchingRules.getRuleName());
        Mailer.UserProperty mailerProperty = user.getProperty(Mailer.UserProperty.class);
        final String emailAddress = payload.getString(BaseFormField.EMAIL.getFieldName());
        if (mailerProperty == null || !emailAddress.equals(mailerProperty.getAddress())) {
            mailerProperty = new Mailer.UserProperty(payload.getString(BaseFormField.EMAIL.getFieldName()));
        }
        try {
            user.addProperty(property);
            user.addProperty(mailerProperty);
            final String userDisplayName = BaseFormField.DISPLAY_NAME.fromJSON(payload);
            user.setFullName(userDisplayName);
            user.save();
        } catch (IOException e) {
            throw new RegistrationException(Messages.RRError_Hudson_UserIO());
        }
        try {
            final Mail mail = ConfirmationEmail.create(createLocalVariables(payload, user), emailAddress);
            mail.send();
        } catch (MailException e) {
            throw new RegistrationException(Messages.RRError_Hudson_EmailAfterInitiation(emailAddress));
        }
    }

    private String getNewUniqueAuthCode() {
        String authCode;
        do {
            authCode = AuthCodeGenerator.genUniqueAuthCode();
        } while (RRHudsonUserProperty.getUserForActivationCode(authCode) != null);
        return authCode;
    }

    private void validateRegisterFormData(JSONObject payload) throws RegistrationException,
            InvalidSecurityRealmException {
        for (IFormValidator validator : registerFormValidators) {
            //noinspection unchecked
            validator.verifyFormData(this, payload);
        }
    }

    @SuppressWarnings("unused")
    @JavaScriptMethod
    public JSONObject checkSecret(String secret) {
        if (SecretKeyChecker.isSecretKeyValid(secret)) {
            return API.success();
        } else {
            return API.errorWithException(new RegistrationException(Messages.RRError_Hudson_Unauthorized()));
        }
    }

    @SuppressWarnings("unused")
    @JavaScriptMethod
    public JSONObject checkActivationCode(String secret, String activationCode) {
        try {
            if (!SecretKeyChecker.isSecretKeyValid(secret)) {
                throw new RegistrationException(Messages.RRError_Hudson_Unauthorized());
            }
            validateActivationCode(activationCode);
        } catch (Exception e) {
            return API.errorWithException(e);
        }
        return API.success();
    }

    private void validateActivationCode(String activationCode) throws RegistrationException {
        final User user = getUserForActivationCode(activationCode);
        if (user == null) {
            throw new RegistrationException(Messages.RRError_Hudson_ActiviationCodeInvalid());
        }
        if (RRHudsonUserProperty.isUserActivated(user)) {
            throw new RegistrationException(Messages.RRError_Hudson_UserIsActivated());
        }
    }

    @SuppressWarnings("unused")
    public String getUsernameFromAuthCode() {
        final StaplerRequest request = Stapler.getCurrentRequest();
        if (request.hasParameter(getCodeParamKey())) {
            final User user = getUserForActivationCode(request.getParameter(getCodeParamKey()));
            if (user != null) {
                return user.getId();
            }
        }
        return "";
    }

    @SuppressWarnings("WeakerAccess")
    public User getUserForActivationCode(String activationCode) {
        return RRHudsonUserProperty.getUserForActivationCode(activationCode);
    }

    @SuppressWarnings("unused")
    @JavaScriptMethod
    public JSONObject activate(JSONObject payload) {
        JSONObject ret;
        try {
            try {
                validateActivateFormData(payload);
                activateAccount(payload);
                ret = API.success();
            } catch (JSONException e) {
                Utils.logError(e);
                throw new RegistrationException(Messages.RRError_Hudson_InvalidEntity());
            }
        } catch (InvalidSecurityRealmException e) {
            ret = API.errorWithMessage(Messages.RRError_SecurityRealmNotApplicable());
        } catch (Exception e) {
            ret = API.errorWithException(e);
            Utils.logError(e);
        }
        return ret;
    }

    private void validateActivateFormData(JSONObject payload) throws RegistrationException,
            InvalidSecurityRealmException {
        for (IFormValidator validator : activateFormValidators) {
            //noinspection unchecked
            validator.verifyFormData(this, payload);
        }
    }

    private void activateAccount(JSONObject payload) throws InvalidSecurityRealmException, RegistrationException {
        final String activationCode = BaseFormField.ACTIVATION_CODE.fromJSON(payload);
        final User user = RRHudsonUserProperty.getUserForActivationCode(activationCode);
        final RRHudsonUserProperty hudsonUserProperty = RRHudsonUserProperty.getPropertyForUser(user);
        final String password = HudsonFormField.PASSWORD.fromJSON(payload);

        assert user != null;
        assert hudsonUserProperty != null;
        assert password != null;
        assert activationCode != null;

        final HudsonPrivateSecurityRealm securityRealm = getSecurityRealm();
        try {
            securityRealm.createAccount(user.getId(), password);
            hudsonUserProperty.setActivated(true);
            hudsonUserProperty.setActivatedAt(Utils.getFormattedTimestamp(new Date()));
            user.addProperty(hudsonUserProperty);
        } catch (IOException e) {
            Utils.logError(e);
            throw new RegistrationException(Messages.RRError_Hudson_UserIO());
        }

        final Mailer.UserProperty mailerProperty = user.getProperty(Mailer.UserProperty.class);
        final String emailAddress = mailerProperty.getAddress();
        try {
            final Mail mail = WelcomeEmail.create(createLocalVariables(payload, user), emailAddress);
            mail.send();
        } catch (MailException e) {
            Utils.logError(e);
            throw new RegistrationException(Messages.RRError_Hudson_EmailErrorAfterActivation(emailAddress));
        }
        try {
            final Mail mail = AdminNotificationEmail.create(createLocalVariables(payload, user));
            mail.send();
        } catch (MailException e) {
            Utils.logError("Failed to send e-mail notification to administrator");
            Utils.logError(e);
        }
    }

    @SuppressWarnings("WeakerAccess")
    public String getCodeParamKey() {
        return BaseFormField.ACTIVATION_CODE.getFieldName();
    }

    private LocalVariables createLocalVariables(JSONObject payload, User user) {
        return LocalVariablesBuilder.start()
                .user(user)
                .payload(payload)
                .build();
    }

    // Describable<HudsonSecurityRealmRegistration> contract

    @Override
    public Descriptor<HudsonSecurityRealmRegistration> getDescriptor() {
        //noinspection ConstantConditions
        return PluginModule.getDefault().getJenkinsDescriptor().getDescriptorForType(this);
    }

    @Extension
    public static class HudsonSecurityRealmRegistrationDescriptor extends Descriptor<HudsonSecurityRealmRegistration> {

        private static final String DISPLAY_NAME = "Hudson security realm registration";

        @Nonnull
        @Override
        public String getDisplayName() {
            return DISPLAY_NAME;
        }
    }
}
