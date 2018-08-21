package com.ubs.network.api.rest.core.controller.interfaces;

import com.ubs.network.api.rest.core.model.dto.TaskUnitDTO;
import com.ubs.network.api.rest.core.model.entities.TaskUnitEntity;

public interface ITaskUnitController<E extends TaskUnitEntity, D extends TaskUnitDTO> extends ICoreBaseController<E, D> {
}
