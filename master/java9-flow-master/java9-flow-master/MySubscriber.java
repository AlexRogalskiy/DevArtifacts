package ru.javabean.java9flow.pubprocsub;
 
import static java.lang.Thread.currentThread;
 
import java.util.Random;
import java.util.concurrent.Flow.Subscriber;
import java.util.concurrent.Flow.Subscription;
 
public class MySubscriber implements Subscriber<String> {
 
    private static final String LOG_MESSAGE_FORMAT = "Subscriber >> [%s] %s%n";
 
    private long DEMAND = 0;
 
    private Subscription subscription;
 
    private long count;
 
    public void setDEMAND(long n) {
        this.DEMAND = n;
        count = DEMAND;
    }
 
    @Override
    public void onSubscribe(Subscription subscription) {
        log("Subscribed");
        this.subscription = subscription;
 
        requestItems(DEMAND);
    }
 
    private void requestItems(long n) {
        log("Requesting %d new items...", n);
        subscription.request(n);
    }
 
    @Override
    public void onNext(String item) {
        if (item != null) {
            log(item);
 
            synchronized (this) {
                count--;
 
                if (count == 0) {
                    log("Cancelling subscription...");
                    subscription.cancel();
                }
            }
        } else {
            log("Null Item!");
        }
    }
 
    @Override
    public void onComplete() {
        log("onComplete(): There is no remaining item in Processor.");
    }
 
    @Override
    public void onError(Throwable t) {
        log("Error >> %s", t);
    }
 
    private void log(String message, Object... args) {
        String fullMessage = String.format(LOG_MESSAGE_FORMAT, currentThread().getName(), message);
 
        System.out.printf(fullMessage, args);
    }
}