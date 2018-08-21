package com.ubs.network.api.rest.common.repository.interfaces;

import org.springframework.data.repository.CrudRepository;

import java.io.Serializable;

public interface IBaseCrudRepository<E extends Serializable, D extends Serializable> extends CrudRepository<E, Long> {

}
