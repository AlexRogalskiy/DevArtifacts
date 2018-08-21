package org.fusesource.camel;

import org.apache.camel.builder.RouteBuilder;

public class OrderRouterExtension extends RouteBuilder {
    @Override
    public void configure() throws Exception {        
        from("jms:orders").to("mock:orders");
    }

}
