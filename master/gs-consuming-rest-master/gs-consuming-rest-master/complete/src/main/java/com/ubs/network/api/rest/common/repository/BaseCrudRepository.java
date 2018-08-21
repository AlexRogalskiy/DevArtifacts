package com.ubs.network.api.rest.common.repository;

import com.ubs.network.api.rest.common.repository.interfaces.IBaseCrudRepository;
import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public class BaseCrudRepository<E extends IBaseEntity, D extends IBaseDTO> implements IBaseCrudRepository<E, D> {
}
