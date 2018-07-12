package com.javabeast.domain.gecode;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Location {

    private String street;
    private String adminArea5;
    private String adminArea4;
    private String adminArea3;
    private String adminArea2;
    private String adminArea1;
    private String postalCode;

}


