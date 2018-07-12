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
public class UDPChannelHeader implements Serializable {
    private static final long serialVersionUID = -4557304960075040713L;

    private int length;
    private String id;
    private int packetType;

}
