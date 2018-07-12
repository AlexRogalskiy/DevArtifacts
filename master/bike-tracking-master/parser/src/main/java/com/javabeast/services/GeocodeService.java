package com.javabeast.services;

import com.javabeast.domain.gecode.Location;
import com.javabeast.domain.gecode.MapQuestGeocodeResult;
import com.javabeast.geocode.GeocodedLocation;
import com.javabeast.repo.GeocodedLocationRepo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Service
public class GeocodeService {

    private final RestTemplate restTemplate;
    private final GeocodedLocationRepo geocodedLocationRepo;


    public GeocodeService(final RestTemplate restTemplate, final GeocodedLocationRepo geocodedLocationRepo) {
        this.restTemplate = restTemplate;
        this.geocodedLocationRepo = geocodedLocationRepo;
    }


    @Cacheable(value = "geocodedLocations", cacheManager = "ehCacheManager")
    public GeocodedLocation getGeocodedLocation(final String position) throws IOException {
        final String positions[] = position.split(",");
        final String latitude = positions[0];
        final String longitude = positions[1];

        final MapQuestGeocodeResult mapQuestGeocodeResult = restTemplate.getForObject("https://www.mapquestapi.com/geocoding/v1/reverse?key=aGuTKpOScwKlumRI93qMRheuNqdyuIEl&location=" + latitude + "," + longitude + "&outFormat=json&thumbMaps=false", MapQuestGeocodeResult.class);
        final GeocodedLocation geocodedLocation = convertFromMapQuest(mapQuestGeocodeResult);
        final GeocodedLocation savedLocation = geocodedLocationRepo.save(geocodedLocation);

        return savedLocation;
    }

    private GeocodedLocation convertFromMapQuest(final MapQuestGeocodeResult mapQuestGeocodeResult) {
        final Location location = mapQuestGeocodeResult.getResults().get(0).getLocations().get(0);
        return GeocodedLocation.builder()
                .adminArea1(location.getAdminArea1())
                .adminArea2(location.getAdminArea2())
                .adminArea3(location.getAdminArea3())
                .adminArea4(location.getAdminArea4())
                .adminArea5(location.getAdminArea5())
                .street(location.getStreet())
                .postalCode(location.getPostalCode())
                .build();
    }
}
