package com.javabeast.services;


import com.javabeast.TextMessage;
import com.twilio.sdk.Twilio;
import com.twilio.sdk.creator.api.v2010.account.MessageCreator;
import com.twilio.sdk.resource.api.v2010.account.Message;
import com.twilio.sdk.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
public class TextService {

    // Find your Account Sid and Token at twilio.com/user/account
    private static final String ACCOUNT_SID = "ACd1c2d7a16d6c935d4a5f5f246cb80699";
    private static final String AUTH_TOKEN = "f02bc460e3c55dfbeaaf56c7acfc5528";

    public void sendText(final TextMessage textMessage) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
        final MessageCreator messageCreator = Message.create(ACCOUNT_SID, new PhoneNumber(textMessage.getTo()), new PhoneNumber("+441282570191"),
                textMessage.getMessage());
        final Message message = messageCreator.execute();
        System.out.println(message.getSid());
    }
}
