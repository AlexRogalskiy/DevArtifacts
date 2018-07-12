package com.javabeast.teltonikia;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.javabeast.TrackerMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class IOEvent implements Serializable {
    private static final long serialVersionUID = -4557304960075040713L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ioEventId;
    private int type;
    private int value;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    private TrackerMessage trackerMessage;
}
