package com.ubs.network.api.rest.common.connector;

import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;
import com.ubs.network.api.rest.common.connector.interfaces.IBaseConnector;

public abstract class BaseConnector<E extends IBaseEntity, D extends IBaseDTO> implements IBaseConnector<E, D> {
}
