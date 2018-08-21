package com.ubs.network.api.rest.common.connector;

import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;

public class OAuth2RestBaseConnector<E extends IBaseEntity, D extends IBaseDTO> extends RestBaseConnector<E, D> {

    public E getById(final Long id) {
        OAuth2RestTemplate restTemplate = this.restTemplate();
        return restTemplate.getForObject(QUICK_POLL_URI_V3 + "/{id}", E.class, id);
    }
}
