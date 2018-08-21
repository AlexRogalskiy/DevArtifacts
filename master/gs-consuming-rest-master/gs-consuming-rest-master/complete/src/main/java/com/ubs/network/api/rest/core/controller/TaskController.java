package com.ubs.network.api.rest.core.controller;

import com.ubs.network.api.rest.core.controller.interfaces.ITaskController;
import com.ubs.network.api.rest.core.model.dto.TaskDTO;
import com.ubs.network.api.rest.core.model.entities.TaskEntity;

public class TaskController<E extends TaskEntity, D extends TaskDTO> extends CoreBaseController<E, D> implements ITaskController<E, D> {
}
