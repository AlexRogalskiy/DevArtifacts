package com.ubs.network.api.rest.common.connector.interfaces;

import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;
import com.ubs.network.api.rest.common.model.wrapper.PageWrapper;

import java.util.List;

public interface IRestBaseConnector<E extends IBaseEntity, D extends IBaseDTO> extends IBaseConnector<E, D> {

    E getById(final D entity);

    E getAll(final D entity);

    void update(final D entityDto);

    void delete(final D entityDto);

    URI create(final D entityDto);

    PageWrapper getAll(int page, int size);

    List<E> getAll();

    E[] getAllAsArray();
}
