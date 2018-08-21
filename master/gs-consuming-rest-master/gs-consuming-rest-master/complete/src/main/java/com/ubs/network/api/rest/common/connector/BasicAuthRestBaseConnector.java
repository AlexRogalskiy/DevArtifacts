package com.ubs.network.api.rest.common.connector;

import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;

public class BasicAuthRestBaseConnector<E extends IBaseEntity, D extends IBaseDTO> extends RestBaseConnector<E, D> {

    public void deleteById(final Long id) {
        final HttpHeaders authenticationHeaders = getAuthenticationHeader("admin", "admin");
        restTemplate.exchange(QUICK_POLL_URI_V3 + "/{id}", HttpMethod.DELETE, new HttpEntity<Void>(authenticationHeaders), Void.class, id);
    }
}
