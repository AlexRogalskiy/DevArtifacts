package com.javabeast.udp;

import com.javabeast.ampq.UdpMessageParser;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.amqp.core.Binding;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.Environment;
import reactor.event.routing.ConsumerInvoker;
import reactor.function.Consumer;
import reactor.function.Function;
import reactor.io.encoding.StandardCodecs;
import reactor.net.NetChannel;
import reactor.net.netty.NettyNetChannel;
import reactor.net.netty.udp.NettyDatagramServer;
import reactor.net.udp.DatagramServer;
import reactor.net.udp.spec.DatagramServerSpec;

import java.util.concurrent.CountDownLatch;

/**
 * Created by jeffreya on 05/11/2016.
 *
 */

//@Configuration
public class Listener {

//    private Log log = LogFactory.getLog(Listener.class);
//
//    @Value("${server.port}")
//    private String port;
//
//
//    @Autowired
//    private UdpMessageParser udpMessageParser;
//
//    @Autowired
//    private Binding binding;
//
//    private NettyNetChannel nettyNetChannel;
//
//
//    public DatagramServer<byte[], byte[]> datagramServer(Environment env) throws InterruptedException {
//        final DatagramServer<byte[], byte[]> server = new DatagramServerSpec<byte[], byte[]>(NettyDatagramServer.class)
//                .env(env)
//                .listen(Integer.valueOf(port))
//                .codec(StandardCodecs.BYTE_ARRAY_CODEC)
//
//                .consume(new Consumer<NetChannel<byte[], byte[]>>() {
//                    @Override
//                    public void accept(NetChannel<byte[], byte[]> netChannel) {
//
//                       // final String hostName = netChannel.remoteAddress().getHostName();
//                        //final int port = netChannel.remoteAddress().getPort();
//                        //System.out.println(hostName);
//                        //System.out.println(port);
//                        netChannel.in().consume(new Consumer<byte[]>() {
//                            @Override
//                            public void accept(byte[] bytes) {
//                                System.out.println(netChannel);
//                                System.out.println("data in here");
//                                udpMessageParser.parseMessage(bytes);
//                            }
//
//                        });
//                    }
//
//                })
//                //.consumeInput(udpMessageParser::parseMessage)
//                .get();
//        server.start().await();
//
//
//        return server;
//    }
//    @Bean
//    public CountDownLatch latch() {
//        return new CountDownLatch(1);
//    }
}
