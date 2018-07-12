package com.javabeast;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.javabeast.teltonikia.GpsElement;
import com.javabeast.teltonikia.IOEvent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;


@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrackerMessage implements Serializable {

    private static final long serialVersionUID = -4557304960075040713L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trackerMessageId;

    private String imei;
    private Date timestamp;

    @JsonManagedReference
    @OneToOne(cascade = CascadeType.ALL)
    private GpsElement gpsElement;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "trackerMessage", cascade = CascadeType.ALL)
    private List<IOEvent> ioEvents;

}
