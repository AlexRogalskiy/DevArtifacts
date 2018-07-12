package com.javabeast.repo;

import com.javabeast.TrackerMessage;
import com.javabeast.teltonikia.GpsElement;
import org.springframework.data.repository.CrudRepository;


public interface GpsElementRepo extends CrudRepository<GpsElement, Long> {

}