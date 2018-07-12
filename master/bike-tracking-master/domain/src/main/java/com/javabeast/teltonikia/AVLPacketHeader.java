package com.javabeast.teltonikia;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AVLPacketHeader implements Serializable {
    private static final long serialVersionUID = -4557304960075040713L;

    private String id;
    private String imei;
}
