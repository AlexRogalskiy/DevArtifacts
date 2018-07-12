package com.javabeast.udp;

import com.javabeast.service.TeltonikaUDPToMessageService;
import com.javabeast.teltonikia.TeltonikaMessage;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.socket.DatagramPacket;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;

@Service
public class UDPDataParser extends SimpleChannelInboundHandler<DatagramPacket> {

    private final TeltonikaUDPToMessageService teltonikaUDPToMessageService;

    @Value("${trackr.unprocessed.queue}")
    private String unprocessedQueue;

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public UDPDataParser(final TeltonikaUDPToMessageService teltonikaUDPToMessageService, final RabbitTemplate rabbitTemplate) {
        this.teltonikaUDPToMessageService = teltonikaUDPToMessageService;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void channelRead0(ChannelHandlerContext ctx, DatagramPacket packet) throws Exception {
        System.err.println(packet);
        ByteBuf buf = packet.content();
        final byte[] bytes = new byte[buf.readableBytes()];
        final int readerIndex = buf.readerIndex();
        buf.getBytes(readerIndex, bytes);

        final TeltonikaMessage teltonikaMessage = teltonikaUDPToMessageService.convertUDPToMessage(bytes);
        System.out.println(teltonikaMessage);


        try {
            //Write RMQ
            rabbitTemplate.convertAndSend(unprocessedQueue, teltonikaMessage);
            //Write ACK
            final byte[] ack = getAckBytes(teltonikaMessage);
            ctx.write(new DatagramPacket(Unpooled.copiedBuffer(ack), packet.sender()));
        } catch (Exception e) {
            System.err.println("Failed to write to RMQ");
            System.err.println(teltonikaMessage);
            e.printStackTrace();
        }

        //write to rabbitmq

    }

    private byte[] getAckBytes(TeltonikaMessage teltonikaMessage) throws IOException {
        final String ack = "0005" + teltonikaMessage.getUdpChannelHeader().getId() + "01"
                + teltonikaMessage.getAvlPacketHeader().getId()
                + Integer.toHexString(0x100 | teltonikaMessage.getAvlData().size()).substring(1).toUpperCase();
        return hexStringToByteArray(ack);
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        ctx.flush();
    }

    private static byte[] hexStringToByteArray(String s) throws IOException {
        final ByteArrayOutputStream bos = new ByteArrayOutputStream();
        final DataOutputStream dos = new DataOutputStream(bos);
        for (int i = 0; i < s.length() / 2; i++) {
            int index = i * 2;
            int value = (Integer.parseInt(s.substring(index, index + 2), 16) & 0xff);
            dos.write(value);
        }
        dos.flush();
        return bos.toByteArray();
    }


    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        // We don't close the channel because we can keep serving requests.
    }

}