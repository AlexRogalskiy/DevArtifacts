package com.javabeast.controllers;

import com.javabeast.TrackerMessage;
import com.javabeast.services.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("device")
public class DeviceController {


    private final DeviceService deviceService;

    @Autowired
    public DeviceController(final DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping(value = "{imei}", produces = MediaType.APPLICATION_JSON_VALUE)
    public TrackerMessage getLatestMessage(@PathVariable("imei") final String imei) {
        return deviceService.getLatestMessage(imei);
    }


}
