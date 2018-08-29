package com.example.captchaserver;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.UUID;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ClientFactoryTests {
    private ClientFactory factory;

    @Before
    public void setUp() {
        factory = new ClientFactory();
    }

    @Test
    public void testIsClientPresentSuccessPublic() {
        Client client = (Client) factory.createObject();
        assertEquals(true, factory.isClientPresent(client.publicKey(), true));
    }

    @Test
    public void testIsClientPresentSuccessPrivate() {
        Client client = (Client) factory.createObject();
        assertEquals(true, factory.isClientPresent(client.privateKey(), false));
    }

    @Test
    public void testIsClientPresentFailurePublic() {
        Client client = (Client) factory.createObject();
        assertEquals(false, factory.isClientPresent(UUID.randomUUID().toString(), true));
    }

    @Test
    public void testIsClientPresentFailurePrivate() {
        Client client = (Client) factory.createObject();
        assertEquals(false, factory.isClientPresent(UUID.randomUUID().toString(), false));
    }
}
