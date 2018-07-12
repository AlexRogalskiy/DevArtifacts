
package com.javabeast.processors;

import com.javabeast.TrackerMessage;
import com.javabeast.repo.TrackerMessageRepo;
import com.javabeast.teltonikia.IOEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


/**
 * Created by jeffreya on 06/11/2016.
 */

@Service
public class TrackerMessageService {

     private final TrackerMessageRepo trackerMessageRepo;

    @Autowired
    public TrackerMessageService(final TrackerMessageRepo trackerMessageRepo) {
        this.trackerMessageRepo = trackerMessageRepo;
    }

    public boolean save(final TrackerMessage trackerMessage) {
        try {

            //set the parent id
            final List<IOEvent> ioEvents = trackerMessage.getIoEvents();
            for (final IOEvent ioEvent : ioEvents) {
                ioEvent.setTrackerMessage(trackerMessage);
            }
            trackerMessage.getGpsElement().setTrackerMessage(trackerMessage);
            trackerMessageRepo.save(trackerMessage);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}