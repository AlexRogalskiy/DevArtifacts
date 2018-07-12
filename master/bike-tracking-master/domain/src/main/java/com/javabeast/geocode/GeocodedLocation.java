package com.javabeast.geocode;

import com.javabeast.teltonikia.GpsElement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeocodedLocation implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String street;
    private String postalCode;
    private String adminArea5;
    private String adminArea4;
    private String adminArea3;
    private String adminArea2;
    private String adminArea1;

}
