package com.ubs.network.api.rest.common.model.dto.error;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ValidationErrorDTO extends BaseErrorDTO{

}
