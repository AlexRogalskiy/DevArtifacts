package com.ubs.network.api.rest.core.controller;

import com.ubs.network.api.rest.common.controller.BaseController;
import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;
import com.ubs.network.api.rest.core.controller.interfaces.ICoreBaseController;

public class CoreBaseController<E extends IBaseEntity, D extends IBaseDTO> extends BaseController<E, D> implements ICoreBaseController<E, D> {
}
