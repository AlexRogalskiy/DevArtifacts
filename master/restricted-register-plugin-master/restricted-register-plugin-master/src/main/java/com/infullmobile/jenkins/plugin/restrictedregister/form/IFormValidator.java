package com.infullmobile.jenkins.plugin.restrictedregister.form;

import com.infullmobile.jenkins.plugin.restrictedregister.RegistrationException;
import com.infullmobile.jenkins.plugin.restrictedregister.security.InvalidSecurityRealmException;
import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;
import net.sf.json.JSONObject;

/**
 * Created by Adam Kobus on 27.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public interface IFormValidator<T extends SecurityRealmRegistration<?>> {

    void verifyFormData(T securityRealmRegistration, JSONObject object) throws RegistrationException,
            InvalidSecurityRealmException;
}
