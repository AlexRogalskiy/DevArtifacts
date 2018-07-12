package com.javabeast;

import com.javabeast.teltonikia.GpsElement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrackerMessageDTO implements Serializable{

    private static final long serialVersionUID = -4557304960075040713L;

    private String imei;
    private Date timestamp;
    private GpsElement gpsElement;

}
