package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form;

import com.infullmobile.jenkins.plugin.restrictedregister.RegistrationException;
import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.form.IFormValidator;
import com.infullmobile.jenkins.plugin.restrictedregister.security.InvalidSecurityRealmException;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.HudsonSecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.Messages;
import net.sf.json.JSONObject;
import org.acegisecurity.userdetails.UsernameNotFoundException;

/**
 * Created by Adam Kobus on 27.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class ExistingUserFormValidator implements IFormValidator<HudsonSecurityRealmRegistration> {

    @Override
    public void verifyFormData(HudsonSecurityRealmRegistration securityRealmRegistration, JSONObject object)
            throws RegistrationException, InvalidSecurityRealmException {
        if (userExists(securityRealmRegistration, object)) {
            throw new RegistrationException(Messages.RRError_Hudson_UserAlreadyExists());
        }
    }

    private boolean userExists(HudsonSecurityRealmRegistration securityRealmRegistration, JSONObject object)
            throws InvalidSecurityRealmException {
        final String username = BaseFormField.USERNAME.fromJSON(object);
        try {
            securityRealmRegistration.getSecurityRealm().loadUserByUsername(username);
            return true;
        } catch (UsernameNotFoundException e) {
            return false;
        }
    }
}
