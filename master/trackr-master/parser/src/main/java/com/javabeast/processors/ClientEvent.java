package com.javabeast.processors;

import com.javabeast.TrackerMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientEvent implements Serializable {

    private String eventType;
    private TrackerMessage trackerMessage;


}
