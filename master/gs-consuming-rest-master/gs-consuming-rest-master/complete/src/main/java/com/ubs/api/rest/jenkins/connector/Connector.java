package com.ubs.api.rest.jenkins.connector;

import java.awt.image.BufferedImage;

import java.util.Collections;
import java.util.List;

import com.ubs.api.rest.common.connector.RestApiConnector;
import com.ubs.api.rest.jenkins.connector.interfaces.IConnector;
import org.springframework.web.client.RestTemplate;

public class Connector extends RestApiConnector implements IConnector {
    private final RestTemplate restTemplate;

    public Connector(final RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void doIt(final String apiKey, final String searchTerm) {
        final List<BufferedImage> photos = this.getPhotosAll(apiKey, searchTerm);
        this.render(searchTerm, photos);
    }

    private List<BufferedImage> getPhotosAll(final String apiKey, final String searchTerm) {
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

    private void render(final String searchTerm, final List<BufferedImage> imageList) {

    }
}

