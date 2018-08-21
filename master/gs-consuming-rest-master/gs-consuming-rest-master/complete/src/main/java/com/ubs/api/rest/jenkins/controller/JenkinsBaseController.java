package com.ubs.api.rest.jenkins.controller;

import com.ubs.api.rest.common.controller.BaseController;
import com.ubs.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.api.rest.common.model.interfaces.IBaseEntity;
import com.ubs.api.rest.jenkins.controller.interfaces.IJenkinsBaseController;

public class JenkinsBaseController<E extends IBaseEntity, D extends IBaseDTO> extends BaseController<E, D> implements IJenkinsBaseController<E, D> {
}
