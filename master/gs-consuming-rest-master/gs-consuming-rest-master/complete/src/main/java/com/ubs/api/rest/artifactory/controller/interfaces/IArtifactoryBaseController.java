package com.ubs.api.rest.artifactory.controller.interfaces;

import com.ubs.api.rest.common.controller.interfaces.IBaseController;
import com.ubs.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.api.rest.common.model.interfaces.IBaseEntity;

public interface IArtifactoryBaseController<E extends IBaseEntity, D extends IBaseDTO> extends IBaseController<E, D> {
}
