package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form;

import com.infullmobile.jenkins.plugin.restrictedregister.RegistrationException;
import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.form.IFormValidator;
import com.infullmobile.jenkins.plugin.restrictedregister.security.InvalidSecurityRealmException;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.HudsonSecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.Messages;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.RRHudsonUserProperty;
import com.infullmobile.jenkins.plugin.restrictedregister.util.Utils;
import hudson.model.User;
import hudson.tasks.Mailer;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.validator.routines.EmailValidator;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class ActivationCodeFormValidator implements IFormValidator<HudsonSecurityRealmRegistration> {

    @Override
    public void verifyFormData(HudsonSecurityRealmRegistration securityRealmRegistration, JSONObject object)
            throws RegistrationException, InvalidSecurityRealmException {
        final String activationCode = BaseFormField.ACTIVATION_CODE.fromJSON(object);
        if (StringUtils.isEmpty(activationCode)) {
            throw new RegistrationException(Messages.RRError_Hudson_ActiviationCodeInvalid());
        }
        final User user = RRHudsonUserProperty.getUserForActivationCode(activationCode);
        final RRHudsonUserProperty hudsonUserProperty = RRHudsonUserProperty.getPropertyForUser(user);
        if (hudsonUserProperty == null) {
            throw new RegistrationException(Messages.RRError_Hudson_ActiviationCodeInvalid());
        }
        if (hudsonUserProperty.getActivated()) {
            throw new RegistrationException(Messages.RRError_Hudson_UserIsActivated());
        }
        final Mailer.UserProperty mailerProperty = user.getProperty(Mailer.UserProperty.class);
        if (mailerProperty == null) {
            throw new RegistrationException(Messages.RRError_Hudson_UserNoEmailAddress());
        }
        final String emailAddress = Utils.fixEmptyString(mailerProperty.getAddress());
        if (!EmailValidator.getInstance().isValid(emailAddress)) {
            throw new RegistrationException(Messages.RRError_Hudson_UserInvalidEmail(emailAddress));
        }
    }
}
