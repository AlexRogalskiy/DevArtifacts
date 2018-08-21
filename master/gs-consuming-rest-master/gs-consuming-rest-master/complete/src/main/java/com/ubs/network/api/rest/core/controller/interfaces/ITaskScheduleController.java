package com.ubs.network.api.rest.core.controller.interfaces;

import com.ubs.network.api.rest.core.model.dto.TaskScheduleDTO;
import com.ubs.network.api.rest.core.model.entities.TaskScheduleEntity;

public interface ITaskScheduleController<E extends TaskScheduleEntity, D extends TaskScheduleDTO> extends ICoreBaseController<E, D> {
}
