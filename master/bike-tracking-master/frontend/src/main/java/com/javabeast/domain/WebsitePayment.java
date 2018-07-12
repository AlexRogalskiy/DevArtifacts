package com.javabeast.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebsitePayment {

//    @NotNull
    private WebsiteOrder websiteOrder;

    private int id;

    @NotNull(message = "Email can not be blank")
    @NotBlank(message = "Email can not be blank")
    private String email;

    @NotNull(message = "First name can not be blank")
    @NotBlank(message = "First name can not be blank")
    private String firstName;

    @NotNull(message = "Last name can not be blank")
    @NotBlank(message = "Last name can not be blank")
    private String lastName;

    @NotNull(message = "Building name / number can not be blank")
    @NotBlank(message = "Building name / number can not be blank")
    private String buildingName;

    @NotNull(message = "Street can not be blank")
    @NotBlank(message = "Street can not be blank")
    private String street;

    private String city;

    private String country;

    @NotNull(message = "Postcode can not be blank")
    @NotBlank(message = "Postcode can not be blank")
    private String postcode;

    @NotNull
    @NotBlank
    private String paymentToken;

    private double price;

}
