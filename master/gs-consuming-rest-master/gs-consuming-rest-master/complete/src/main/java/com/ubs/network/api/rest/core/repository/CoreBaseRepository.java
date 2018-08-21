package com.ubs.network.api.rest.core.repository;

import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;
import com.ubs.network.api.rest.common.repository.BaseCrudRepository;
import com.ubs.network.api.rest.core.repository.interfaces.ICoreBaseRepository;

public class CoreBaseRepository<E extends IBaseEntity, D extends IBaseDTO> extends BaseCrudRepository<E, D> implements ICoreBaseRepository<E, D> {
}
