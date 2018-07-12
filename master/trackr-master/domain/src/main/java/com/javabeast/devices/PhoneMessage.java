package com.javabeast.devices;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PhoneMessage {

    private String deviceId;
    private String imei;

    private long deviceTimestamp;
    private long systemTimestamp;

    private double lat;
    private double lng;
    private double speed;
    private double accuracy;

}
