package com.ubs.network.api.rest.core.repository;

import com.ubs.network.api.rest.core.model.dto.TaskSubscriptionDTO;
import com.ubs.network.api.rest.core.model.entities.TaskSubscriptionEntity;
import com.ubs.network.api.rest.core.repository.interfaces.ITaskSubscriptionRepository;

public class TaskSubscriptionRepository<E extends TaskSubscriptionEntity, D extends TaskSubscriptionDTO> extends CoreBaseRepository<E, D> implements ITaskSubscriptionRepository<E, D> {
}
