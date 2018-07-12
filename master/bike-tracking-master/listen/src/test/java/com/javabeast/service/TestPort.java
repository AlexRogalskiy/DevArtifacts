package com.javabeast.service;


import java.io.IOException;
import java.net.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class TestPort {

    private static final String MESSAGE_FILE_PATH = "/Users/jeffreya/workspace/trackr/backend/listen/src/test/resources/tracker_message.dat";
    private static byte[] data;

    static {
        try {
            final Path path = Paths.get(MESSAGE_FILE_PATH);
            data = Files.readAllBytes(path);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) throws IOException {
        final DatagramSocket datagramSocket = new DatagramSocket(4999);
        final InetAddress address = InetAddress.getByName(args.length == 0 ? "127.0.0.1" : args[0]);
        System.out.println("Sending packet to: " + address);
        final DatagramPacket datagramPacket = new DatagramPacket(data, data.length, address, 5000);
        datagramSocket.send(datagramPacket);
    }
}
