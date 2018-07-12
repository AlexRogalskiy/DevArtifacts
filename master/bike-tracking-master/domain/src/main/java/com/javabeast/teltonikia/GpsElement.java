package com.javabeast.teltonikia;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.javabeast.TrackerMessage;
import com.javabeast.geocode.GeocodedLocation;
import lombok.*;
import org.springframework.data.annotation.Transient;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Builder
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class GpsElement implements Serializable {
    private static final long serialVersionUID = -4557304960075040713L;
    private static final double EPSILON = 0.0001;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gpsElementId;

    private double latitude;
    private double longitude;
    private long altitude;
    private long angle;
    private int satellites;
    private long speed;

    @JsonBackReference
    @OneToOne
    private TrackerMessage trackerMessage;

    @Transient
    public String getLatLngString() {
        return latitude + "," + longitude;
    }


    @ManyToOne(fetch = FetchType.EAGER)
    private GeocodedLocation geocodedLocation;

    @Override
    public int hashCode() {
        final double lat = Math.round(latitude * 10000d) / 10000d;
        final double lng = Math.round(latitude * 10000d) / 10000d;
        return Long.valueOf(Double.doubleToLongBits(lat)).hashCode() +
                Long.valueOf(Double.doubleToLongBits(lng)).hashCode();

    }

}
