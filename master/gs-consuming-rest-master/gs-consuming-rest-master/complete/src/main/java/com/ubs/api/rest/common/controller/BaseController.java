package com.ubs.api.rest.common.controller;

import com.ubs.api.rest.common.controller.interfaces.IBaseController;
import com.ubs.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.api.rest.common.model.interfaces.IBaseEntity;

public class BaseController<E extends IBaseEntity, D extends IBaseDTO> implements IBaseController<E, D> {
}
