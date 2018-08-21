package com.ubs.network.api.rest.core.controller.interfaces;

import com.ubs.network.api.rest.core.model.dto.TaskSubscriptionDTO;
import com.ubs.network.api.rest.core.model.entities.TaskSubscriptionEntity;

public interface ITaskSubscriptionController<E extends TaskSubscriptionEntity, D extends TaskSubscriptionDTO> extends ICoreBaseController<E, D> {
}
