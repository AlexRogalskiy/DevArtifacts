package com.javabeast.repo;

import com.javabeast.TrackerMessage;
import org.springframework.data.repository.CrudRepository;

public interface TrackerMessageRepo extends CrudRepository<TrackerMessage, Long> {

    TrackerMessage findTop1ByImeiOrderByTimestampDesc(String imei);

}