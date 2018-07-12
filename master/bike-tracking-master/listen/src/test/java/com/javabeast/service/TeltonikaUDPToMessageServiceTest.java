package com.javabeast.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.javabeast.teltonikia.*;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class TeltonikaUDPToMessageServiceTest {

    private final TeltonikaUDPToMessageService teltonikaUDPToMessageService = new TeltonikaUDPToMessageService();
    //  private final String dataString = "0178CAFE01DD31323334353637383930313233343536080400000113fc208dff000f14f650209cca80006f00d60400040004030101150316030001460000015d0000000113fc17610b000f14ffe0209cc580006e00c00500010004030101150316010001460000015e0000000113fc284945000f150f00209cd200009501080400000004030101150016030001460000015d0000000113fc267c5b000f150a50209cccc0009300680400000004030101150016030001460000015b0004";
    // private final byte[] data = dataString.getBytes();

    private static final URL MESSAGE_FILE_PATH = TeltonikaUDPToMessageServiceTest.class.getResource("tracker_message.dat");
    private static byte[] data;

    @Before
    public void before() {
        try {
            final ClassLoader classLoader = getClass().getClassLoader();
            final File file = new File(classLoader.getResource("tracker_message.dat").getFile());
            final Path path = Paths.get(file.toURI());
            data = Files.readAllBytes(path);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void convertUDPToMessage() throws Exception {
        final TeltonikaMessage teltonikaMessage = teltonikaUDPToMessageService.convertUDPToMessage(data);
        assertNotNull(teltonikaMessage);
        assertNotNull(teltonikaMessage.getUdpChannelHeader());
        assertNotNull(teltonikaMessage.getAvlPacketHeader());
        assertNotNull(teltonikaMessage.getAvlData());


        final ObjectMapper objectMapper = new ObjectMapper();
        final String s = objectMapper.writeValueAsString(teltonikaMessage);
        System.out.println(s);
    }

    @Test
    public void parseUDPChannelHeader() throws Exception {
        final TeltonikaMessage teltonikaMessage = teltonikaUDPToMessageService.convertUDPToMessage(data);

        final UDPChannelHeader udpChannelHeader = teltonikaMessage.getUdpChannelHeader();
        assertNotNull(udpChannelHeader);

        final int length = udpChannelHeader.getLength();
        final int expectedLength = 624;
        assertEquals(expectedLength, length);

        final String id = udpChannelHeader.getId();
        final String expectedId = "CAFE";
        assertEquals(expectedId, id);

        final int packetType = udpChannelHeader.getPacketType();
        final int expectedPacketType = 1;
        assertEquals(expectedPacketType, packetType);
    }

    @Test
    public void parseAVLPacketHeader() {
        final TeltonikaMessage teltonikaMessage = teltonikaUDPToMessageService.convertUDPToMessage(data);
        final AVLPacketHeader avlPacketHeader = teltonikaMessage.getAvlPacketHeader();
        assertNotNull(avlPacketHeader);

        final String id = avlPacketHeader.getId();
        final String expectedId = "06";
        assertEquals(expectedId, id);

        final String imei = avlPacketHeader.getImei();
        final String expectedImei = "357454071854283";
        assertEquals(expectedImei, imei);
    }

    @Test
    public void parseAVLData() {
        final TeltonikaMessage teltonikaMessage = teltonikaUDPToMessageService.convertUDPToMessage(data);
        final List<AVLData> avlDataList = teltonikaMessage.getAvlData();
        assertNotNull(avlDataList);

        final int expectedRecords = 15;
        assertEquals(expectedRecords, avlDataList.size());

        final AVLData avlData = avlDataList.get(0);
        assertNotNull(avlData);

        final GpsElement gpsElement = avlData.getGpsElement();
        assertNotNull(gpsElement);
    }

}