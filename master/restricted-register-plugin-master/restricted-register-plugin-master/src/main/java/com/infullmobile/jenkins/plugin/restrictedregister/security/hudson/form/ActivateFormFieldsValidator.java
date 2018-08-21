package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form;

import com.infullmobile.jenkins.plugin.restrictedregister.RegistrationException;
import com.infullmobile.jenkins.plugin.restrictedregister.form.IFormValidator;
import com.infullmobile.jenkins.plugin.restrictedregister.security.InvalidSecurityRealmException;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.HudsonSecurityRealmRegistration;
import net.sf.json.JSONObject;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class ActivateFormFieldsValidator implements IFormValidator<HudsonSecurityRealmRegistration> {

    private static final int MIN_PASSWORD_LENGTH = 8;

    @Override
    public void verifyFormData(HudsonSecurityRealmRegistration securityRealmRegistration, JSONObject object)
            throws RegistrationException, InvalidSecurityRealmException {
        RequiredFieldsChecker.checkRequiredFields(object,
                HudsonFormField.PASSWORD,
                HudsonFormField.PASSWORD_REPEAT);
        final String password = HudsonFormField.PASSWORD.fromJSON(object);
        final String repeatPassword = HudsonFormField.PASSWORD_REPEAT.fromJSON(object);
        if (!password.equals(repeatPassword)) {
            throw new RegistrationException("Passwords don't match",
                    HudsonFormField.PASSWORD,
                    HudsonFormField.PASSWORD_REPEAT);
        }
        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new RegistrationException("Password must be at least " + MIN_PASSWORD_LENGTH +
                    " characters long", HudsonFormField.PASSWORD);
        }
    }
}
