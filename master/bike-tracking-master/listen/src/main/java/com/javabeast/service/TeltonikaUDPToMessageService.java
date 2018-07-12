package com.javabeast.service;

import com.javabeast.teltonikia.*;
import org.springframework.stereotype.Service;

import javax.xml.bind.DatatypeConverter;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


@SuppressWarnings("UnusedAssignment")
@Service
public class TeltonikaUDPToMessageService {

    private static final int RADIX = 16;
    private static final int AVL_PACKET_HEADER_OFFSET = 10;
    private static final int AVL_PACKET_HEADER_SIZE = 36;
    private static final int AVL_DATA_OFFSET = AVL_PACKET_HEADER_OFFSET + AVL_PACKET_HEADER_SIZE;

    public TeltonikaMessage convertUDPToMessage(final byte[] bytes) {
        final String hexData = getHexData(bytes);
        final UDPChannelHeader udpChannelHeader = parseUDPChannelHeader(hexData);
        final AVLPacketHeader avlPacketHeader = parseAVLPacketHeader(hexData);
        final List<AVLData> avlDataList = parseAVLData(hexData);

        return TeltonikaMessage.builder()
                .udpChannelHeader(udpChannelHeader)
                .avlPacketHeader(avlPacketHeader)
                .avlData(avlDataList)
                .build();
    }

    private UDPChannelHeader parseUDPChannelHeader(final String hexData) {
        final int length = getLength(hexData);
        final String id = getUDPChannelHeader(hexData);
        final int packetType = getPacketType(hexData);
        return UDPChannelHeader.builder()
                .length(length)
                .id(id)
                .packetType(packetType)
                .build();
    }

    private int getLength(String hexString) {
        final String lengthHex = hexString.substring(0, 4);
        return Integer.parseInt(lengthHex, RADIX);
    }

    private String getUDPChannelHeader(final String hexString) {
        return hexString.substring(4, 8);
    }

    private int getPacketType(final String hexString) {
        final String packetType = hexString.substring(8, 10);
        return Integer.parseInt(packetType, RADIX);
    }

    private AVLPacketHeader parseAVLPacketHeader(final String data) {
        final String hexData = data.substring(AVL_PACKET_HEADER_OFFSET);
        final String avlPacketHeaderId = getAVLPacketHeaderId(hexData);
        final String imei = getImeiNumber(hexData);

        return AVLPacketHeader.builder()
                .id(avlPacketHeaderId)
                .imei(imei)
                .build();
    }

    private String getAVLPacketHeaderId(final String hexData) {
        return hexData.substring(0, 2);
    }

    private String getImeiNumber(final String hexData) {
        final String imeiHex = hexData.substring(2, 36);
        final byte[] bytes = DatatypeConverter.parseHexBinary(imeiHex);
        return new String(bytes).replaceAll("[^A-Za-z0-9 ]", "");
    }

    private List<AVLData> parseAVLData(final String data) {
        final String hexData = data.substring(AVL_DATA_OFFSET);
        final int numOfRecords = getNumberOfRecords(hexData);
        return getAvlDatas(numOfRecords, hexData);
    }

    @SuppressWarnings("UnusedAssignment")
    private List<AVLData> getAvlDatas(final int numOfRecords, final String data) {
        final String hexData = data.substring(4);
        final List<AVLData> avlDataList = new ArrayList<>();

        int position = 0;
        for (int i = 0; i < numOfRecords; i++) {
            final String timestampHex = hexData.substring(position, position += 16);
            final Date timestamp = getTimestamp(timestampHex);

            final int priority = Integer.parseInt(hexData.substring(position, position += 2), RADIX);
            final String gpsHex = hexData.substring(position, position += 30);

            final GpsElement gpsElement = parseGpsElement(gpsHex);

            final String ioHex = hexData.substring(position);
            final int eventId = Integer.parseInt(hexData.substring(position, position += 2), RADIX);
            final int ioEventsTotal = Integer.parseInt(hexData.substring(position, position += 2), RADIX);

            final List<IOEvent> eventList = new ArrayList<>();
            position = getIOEvents(hexData, position, eventList, 2);
            position = getIOEvents(hexData, position, eventList, 4);
            position = getIOEvents(hexData, position, eventList, 8);
            position = getIOEvents(hexData, position, eventList, 16);

            final AVLData avlData = AVLData.builder()
                    .timestamp(timestamp)
                    .priority(priority)
                    .ioEventList(eventList)
                    .gpsElement(gpsElement)
                    .build();
            avlDataList.add(avlData);
        }
        return avlDataList;
    }

    private Date getTimestamp(String timestampHex) {
        final long elapsed = Long.parseLong(timestampHex, RADIX);
        return new Date(elapsed);
    }

    @SuppressWarnings("UnusedAssignment")
    private GpsElement parseGpsElement(final String gpsHex) {
        int position = 0;
        final String longitudeHex = gpsHex.substring(position, position += 8);
        final String latitudeHex = gpsHex.substring(position, position += 8);
        final long altitude = Long.parseLong(gpsHex.substring(position, position += 4), RADIX);
        final long angle = Long.parseLong(gpsHex.substring(position, position += 4), RADIX);
        final int satellites = Integer.parseInt(gpsHex.substring(position, position + 2), RADIX);
        final long speed = Long.parseLong(gpsHex.substring(position, position += 4), RADIX);

        final double longitude = getLatLng(longitudeHex);
        final double latitude = getLatLng(latitudeHex);

        return GpsElement.builder()
                .latitude(latitude)
                .longitude(longitude)
                .speed(speed)
                .angle(angle)
                .altitude(altitude)
                .satellites(satellites)
                .build();
    }


    @SuppressWarnings("UnusedAssignment")
    private double getLatLng(final String value) {
        final Long parsedValue = Long.parseLong(value, RADIX);
        final String binaryString = String.format("%32s", Long.toBinaryString(parsedValue)).replace(" ", "0");
        final boolean isTwosCompliment = binaryString.charAt(0) != '0';
        final Long calculationValue = isTwosCompliment ? Long.parseLong(Integer.toBinaryString(~parsedValue.intValue()), 2) : parsedValue;
        final Long position = isTwosCompliment ? ~calculationValue : calculationValue;
        return (double) (position) / 10000000;
    }

    @SuppressWarnings("UnusedAssignment")
    private int getIOEvents(final String hexData, final int startPosition, final List<IOEvent> events, final int stepSize) {
        int position = startPosition;
        final int eventTotal = Integer.parseInt(hexData.substring(position, position += 2), RADIX);
        for (int eventCount = 0; eventCount < eventTotal; eventCount++) {
            final int elementId = Integer.parseInt(hexData.substring(position, position += 2), RADIX);
            final int elementValue = Integer.parseInt(hexData.substring(position, position += stepSize), RADIX);
            events.add(IOEvent.builder().type(elementId).value(elementValue).build());
        }
        return position;
    }

    private int getNumberOfRecords(String hexData) {
        return Integer.parseInt(hexData.substring(2, 4), RADIX);
    }

    private int getCodec(final String codecHex) {
        return Integer.parseInt(codecHex.substring(0, 2), RADIX);
    }

    private String getHexData(final byte[] bytes) {
        final String hexString = byteArrayToString(bytes);
        return hexString.replace("\n", "").replace("\r", "").replace(" ", "");
    }

    private static String byteArrayToString(byte[] ba) {
        StringBuilder sb = new StringBuilder();
        for (byte b : ba) {
            sb.append(String.format("%02X ", b));
        }
        return sb.toString();
    }
}
