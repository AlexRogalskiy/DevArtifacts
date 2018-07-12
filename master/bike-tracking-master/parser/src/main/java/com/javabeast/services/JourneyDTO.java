package com.javabeast.services;


import com.javabeast.TrackerMessage;
import com.javabeast.TrackerMessageDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JourneyDTO {
    private TrackerMessage startMessage;
    private TrackerMessage endMessage;
}
