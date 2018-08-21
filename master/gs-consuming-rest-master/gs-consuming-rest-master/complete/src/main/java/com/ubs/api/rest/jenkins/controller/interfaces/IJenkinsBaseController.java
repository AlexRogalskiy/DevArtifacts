package com.ubs.api.rest.jenkins.controller.interfaces;

import com.ubs.api.rest.common.controller.interfaces.IBaseController;
import com.ubs.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.api.rest.common.model.interfaces.IBaseEntity;

public interface IJenkinsBaseController<E extends IBaseEntity, D extends IBaseDTO> extends IBaseController<E, D> {
}
