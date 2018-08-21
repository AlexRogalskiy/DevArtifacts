package com.ubs.network.api.rest.core.repository.interfaces;

import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;
import com.ubs.network.api.rest.common.repository.interfaces.IBaseCrudRepository;

public interface ICoreBaseRepository<E extends IBaseEntity, D extends IBaseDTO> extends IBaseCrudRepository<E, D> {

}
