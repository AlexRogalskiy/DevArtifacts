package com.ubs.network.api.rest.services.jenkins.connector.interfaces;

import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;
import com.ubs.network.api.rest.common.connector.interfaces.IRestBaseConnector;

public interface IJenkinsRestBaseConnector<E extends IBaseEntity, D extends IBaseDTO> extends IRestBaseConnector<E, D> {
}
