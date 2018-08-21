package com.ubs.api.rest.artifactory.controller;

import com.ubs.api.rest.artifactory.controller.interfaces.IArtifactoryBaseController;
import com.ubs.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.api.rest.common.model.interfaces.IBaseEntity;

public class ArtifactoryBaseController<E extends IBaseEntity, D extends IBaseDTO> implements IArtifactoryBaseController<E, D> {
}
