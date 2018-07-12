package com.javabeast.services;


import com.javabeast.TrackerMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Journey implements Serializable{
    private List<TrackerMessage> trackerMessageList = new ArrayList<>();
}
