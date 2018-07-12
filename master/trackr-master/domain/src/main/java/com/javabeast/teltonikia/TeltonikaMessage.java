package com.javabeast.teltonikia;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeltonikaMessage implements Serializable {

    private static final long serialVersionUID = -4557304960075040713L;

    @Id
    private Long id;

    @Transient
    private UDPChannelHeader udpChannelHeader;
    private AVLPacketHeader avlPacketHeader;

    private List<AVLData> avlData;

}
