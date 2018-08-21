package com.ubs.network.api.rest.services.jenkins.connector;

import java.awt.image.BufferedImage;

import java.util.Collections;
import java.util.List;

import com.ubs.network.api.rest.services.jenkins.connector.interfaces.IJenkinsRestBaseConnector;
import com.ubs.network.api.rest.common.connector.RestBaseConnector;
import com.ubs.network.api.rest.common.model.interfaces.IBaseDTO;
import com.ubs.network.api.rest.common.model.interfaces.IBaseEntity;

import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;

public class JenkinsRestBaseConnector<E extends IBaseEntity, D extends IBaseDTO> extends RestBaseConnector<E, D> implements IJenkinsRestBaseConnector<E, D> {
    private final RestTemplate restTemplate;

    public JenkinsRestBaseConnector(final RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void doIt(final String apiKey, final String searchTerm) {
        final List<BufferedImage> photos = this.getPhotosAll(apiKey, searchTerm);
        this.render(searchTerm, photos);
    }

    public List<BufferedImage> getPhotosAll(final String apiKey, final String searchTerm) {
//        final String photoSearchUrl = "http://www.flickr.com/services/rest?method=flickr.photos.search&api+key={api-key}&tags={tag}&per_page=10";
//        final Source photos = this.restTemplate.getForObject(photoSearchUrl, Source.class, apiKey, searchTerm);
//
//        final String photoUrl = "http://static.flickr.com/{server}/{id}_{secret}_m.jpg";
//        return (List<BufferedImage>) xpathTemplate.evaluate("//photo", photos, new NodeMapper() {
//            public Object mapNode(Node node, int i) throws DOMException {
//                final Element photo = (Element) node;
//
//                final Map<String, String> variables = new HashMap<String, String>(3);
//                variables.put("server", photo.getAttribute("server"));
//                variables.put("id", photo.getAttribute("id"));
//                variables.put("secret", photo.getAttribute("secret"));
//
//                return this.restTemplate.getForObject(photoUrl, BufferedImage.class, variables);
//            }
//        });
        return Collections.emptyList();
    }

    public void render(final String searchTerm, final List<BufferedImage> imageList) {

    }

    public Poll getPollById(final Long pollId) {
        final OAuth2RestTemplate restTemplate = this.getRestTemplate();
        return restTemplate.getForObject(QUICK_POLL_URI_V3 + "/{pollId}", Poll. class, pollId);
    }

    public PageWrapper getAllPolls(int page, int size) {
        ParameterizedTypeReference> responseType = new ParameterizedTypeReference>() {};
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(QUICK_POLL_URI_2).queryParam("page", page).queryParam("size", size);
        ResponseEntity> responseEntity = restTemplate.exchange(builder.build().toUri(), HttpMethod.GET, null, responseType);
        return responseEntity.getBody();
    }
}

