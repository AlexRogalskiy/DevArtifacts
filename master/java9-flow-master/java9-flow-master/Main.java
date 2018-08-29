package ru.javabean.java9flow.pubprocsub;
 
public class MainApp {
 
    public static void main(String[] args) throws InterruptedException {
         
        MyPublisher publisher = new MyPublisher();
         
        MySubscriber subscriber = new MySubscriber();
        subscriber.setDEMAND(3); // MUST set number of items to be requested here!
         
        MyProcessor processor = new MyProcessor();
        processor.setDEMAND(3); // MUST set number of items to be requested here!
         
        publisher.subscribe(processor);
        processor.subscribe(subscriber);
         
        publisher.waitUntilTerminated();
         
    }
}