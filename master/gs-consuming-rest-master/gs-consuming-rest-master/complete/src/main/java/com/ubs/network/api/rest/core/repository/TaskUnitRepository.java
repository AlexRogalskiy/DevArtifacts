package com.ubs.network.api.rest.core.repository;

import com.ubs.network.api.rest.core.model.dto.TaskUnitDTO;
import com.ubs.network.api.rest.core.model.entities.TaskUnitEntity;
import com.ubs.network.api.rest.core.repository.interfaces.ITaskUnitRepository;

public class TaskUnitRepository<E extends TaskUnitEntity, D extends TaskUnitDTO> extends CoreBaseRepository<E, D> implements ITaskUnitRepository<E, D> {

}
