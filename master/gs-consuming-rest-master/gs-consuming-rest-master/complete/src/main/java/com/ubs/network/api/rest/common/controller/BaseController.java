package com.ubs.network.api.rest.common.controller;

import com.ubs.network.api.rest.common.controller.interfaces.IBaseController;
import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BaseController<E extends IBaseEntity, D extends IBaseDTO> implements IBaseController<E, D> {
    protected final Logger log = LoggerFactory.getLogger(this.getClass());
}
