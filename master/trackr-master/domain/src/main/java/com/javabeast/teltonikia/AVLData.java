package com.javabeast.teltonikia;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AVLData implements Serializable {
    private static final long serialVersionUID = -4557304960075040713L;

    @Id
    private Long id;

    private Date timestamp;
    private int priority;
    private GpsElement gpsElement;
    private List<IOEvent> ioEventList;
}
