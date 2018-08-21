package com.ubs.network.api.rest.common.connector;

import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;
import com.ubs.network.api.rest.common.connector.interfaces.IRestBaseConnector;
import com.ubs.network.api.rest.common.model.wrapper.PageWrapper;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

public abstract class RestBaseConnector<E extends IBaseEntity, D extends IBaseDTO> extends BaseConnector<E, D> implements IRestBaseConnector<E, D> {

    @Override
    public E getById(final Long id) {
//        OAuth2RestTemplate restTemplate = restTemplate();
//        return restTemplate.getForObject(QUICK_POLL_URI_V3 + "/{entityDtoId}", Poll. class, pollId);
    }

    @Override
    public void update(final D entityDTO) {
        //restTemplate.put(QUICK_POLL_URI_V1 + "/{pollId}", } poll, poll.getId());
    }

    @Override
    public void delete(final D entityDTO) {
        //restTemplate.delete(QUICK_POLL_URI_V1 + "/{pollId}", } pollId);
    }

    @Override
    public URI create(final D entityDTO) {
        //return restTemplate.postForLocation( QUICK_POLL_URI_V1, entityDto);
    }

    @Override
    public PageWrapper<E> getAll(int page, int size) {
        final ParameterizedTypeReference<List<E>> responseType = new ParameterizedTypeReference<>() {};
        final UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(QUICK_POLL_URI_2).queryParam("page", page).queryParam("size", size);
        final ResponseEntity responseEntity = restTemplate.exchange(builder.build().toUri(), HttpMethod.GET, null, responseType);
        final PageWrapper<E> allPolls = responseEntity.getBody();
        return allPolls;
    }

    @Override
    public List<E> getAll() {
        final ParameterizedTypeReference<List<E>> responseType = new ParameterizedTypeReference<>() {};
        final ResponseEntity<List<E>> responseEntity = restTemplate.exchange(QUICK_POLL_URI_V1, HttpMethod.GET, null, responseType);
        return responseEntity.getBody();
    }

    @Override
    public E[] getAllAsArray() {
        return restTemplate.getForObject(QUICK_POLL_URI_V1, E[].class);
    }
}
