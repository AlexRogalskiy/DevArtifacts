package com.ubs.network.api.rest.core.controller.interfaces;

import com.ubs.network.api.rest.core.model.dto.TaskDTO;
import com.ubs.network.api.rest.core.model.entities.TaskEntity;

public interface ITaskController<E extends TaskEntity, D extends TaskDTO> extends ICoreBaseController<E, D> {
}
