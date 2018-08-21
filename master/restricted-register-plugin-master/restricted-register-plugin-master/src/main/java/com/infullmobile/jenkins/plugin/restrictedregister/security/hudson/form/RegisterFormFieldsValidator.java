package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form;

import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.form.IFormValidator;
import com.infullmobile.jenkins.plugin.restrictedregister.RegistrationException;
import com.infullmobile.jenkins.plugin.restrictedregister.security.InvalidSecurityRealmException;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.HudsonSecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.Messages;
import net.sf.json.JSONObject;
import org.apache.commons.validator.routines.EmailValidator;

/**
 * Created by Adam Kobus on 27.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class RegisterFormFieldsValidator implements IFormValidator<HudsonSecurityRealmRegistration> {

    @Override
    public void verifyFormData(HudsonSecurityRealmRegistration securityRealmRegistration,
                               JSONObject object) throws RegistrationException, InvalidSecurityRealmException {
        RequiredFieldsChecker.checkRequiredFields(object,
                BaseFormField.USERNAME,
                BaseFormField.DISPLAY_NAME,
                BaseFormField.EMAIL);

        final String emailAddress = BaseFormField.EMAIL.fromJSON(object);
        if (!EmailValidator.getInstance().isValid(emailAddress)) {
            throw new RegistrationException(Messages.RRError_Hudson_UserInvalidEmail(emailAddress),
                    BaseFormField.EMAIL);
        }
    }
}
