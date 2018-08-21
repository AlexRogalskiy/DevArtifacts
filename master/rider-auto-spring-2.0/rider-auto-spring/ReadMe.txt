Example from "Open Source Integration with Apache Camel" Article
========================================================

To run this example project build the project and execute the Camel routes 
according to the steps below. 

Setup
==============================

- Install Eclipse 3.6.2
    - Download distribution from http://www.eclipse.org. 
    - Unzip the downloaded Eclipse distribution to a location on your hard disk 
    that you find suitable.

- Install Apache Maven 3+
    - Download distribution from http://maven.apache.org. 
    - Unzip the downloaded Maven distribution to a location on your hard disk
    that you find suitable.
    - configure this location as the environment variable MAVEN_HOME
    - add MAVEN_HOME/bin to your PATH environment variable

- Install Fuse IDE for Camel
    - Follow the instructions at: 
      http://fusesource.com/docs/ide/camel/1.0/install_guide/index.html

Running the Camel application
============================

Try executing with:

  mvn camel:run

This will load up the Camel application as described in the article. 

Running Tests
============================

You will probably find it much more useful to run the tests included with
this example though. The tests send messages to the endpoints and add 
mock endpoints for the detection of the messages on the orderQueue.

To run the tests, issue the following Maven command:

mvn test

The tests add the route defined in the file

./src/test/java/org/fusesource/camel/OrderRouterExtension.java

This file basically adds from("jms:orders").to("mock:orders") so that
all messages passing through the normalizer into the orders JMS queue
will be sent to the "orders" mock endpoint. The MockEndpoint in Camel
contains methods helpful for expecting certain message contents (plus
other features that we won't touch on here).

The unit test is in this file

./src/test/java/org/fusesource/camel/PlaceOrderTest.java

To place two file orders we copy the premade file orders to the directory 
where the file endpoint is listening on ("target/placeorder")

        IOHelper.copyFile(new File("src/data/message1.xml"), new File("target/placeorder/message1.xml"));
        IOHelper.copyFile(new File("src/data/message2.csv"), new File("target/placeorder/message2.csv")); 

The mock endpoint basically asserts that the two normalized messages make it to the mock endpoint.

To place an XML order over HTTP we use the camel-http component. Sending to an 
endpoint in Camel programatically is easy when the ProducerTemplate class is 
used. In our case, this is created automatically because we extend the test 
case from ContextTestSupport. We just have to reference the "template" field and 
use the requestBody method. This method will send the message content (a String 
with XML data) to the HTTP endpoint and will wait for the HTTP response. In 
our case, we have defined the response to be a simple "OUT" String.

        Object response = template.requestBody("http://localhost:8888/placeorder", body);

Loading into Eclipse
============================

Use m2eclipse to import the project(s). In Eclipse, 
  - Select File->Import...
  - Select Maven->Existing Maven Projects... and click Next
  - Browse to the directory where you extracted the example
  - You should now be able to select the rider-auto-spring project to import

Documentation on how to use Fuse IDE can be found at http://fusesource.com/products/fuse-ide-camel/

Getting Help
============================

If you hit any problems please let the FuseSource team know on the forums
  http://fusesource.com/forums/forum.jspa?forumID=2
