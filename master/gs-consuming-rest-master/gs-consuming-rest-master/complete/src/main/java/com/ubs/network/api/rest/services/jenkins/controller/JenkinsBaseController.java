package com.ubs.network.api.rest.services.jenkins.controller;

import com.ubs.network.api.rest.common.controller.BaseController;
import com.ubs.network.api.rest.services.jenkins.controller.interfaces.IJenkinsBaseController;
import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;

public class JenkinsBaseController<E extends IBaseEntity, D extends IBaseDTO> extends BaseController<E, D> implements IJenkinsBaseController<E, D> {
}
