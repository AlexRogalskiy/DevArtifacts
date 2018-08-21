package com.ubs.network.api.rest.services.artifactory.controller;

import com.ubs.network.api.rest.common.controller.BaseController;
import com.ubs.network.api.rest.services.artifactory.controller.interfaces.IArtifactoryBaseController;
import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;

public class ArtifactoryBaseController<E extends IBaseEntity, D extends IBaseDTO> extends BaseController<E, D> implements IArtifactoryBaseController<E, D> {
}
