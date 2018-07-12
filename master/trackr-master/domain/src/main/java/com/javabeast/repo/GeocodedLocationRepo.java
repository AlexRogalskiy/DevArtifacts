package com.javabeast.repo;

import com.javabeast.TrackerMessage;
import com.javabeast.geocode.GeocodedLocation;
import org.springframework.data.repository.CrudRepository;


public interface GeocodedLocationRepo extends CrudRepository<GeocodedLocation, Long> {

}