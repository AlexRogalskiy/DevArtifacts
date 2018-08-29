package ru.javabean.java9flow.pubprocsub;
 
import static java.lang.Thread.currentThread;
import static java.util.concurrent.Executors.newSingleThreadExecutor;
 
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Flow.Processor;
import java.util.concurrent.Flow.Subscriber;
import java.util.concurrent.Flow.Subscription;
import java.util.concurrent.atomic.AtomicBoolean;
 
public class MyProcessor implements Processor<Integer, String> {
 
    private static final String LOG_MESSAGE_FORMAT = "Processor >> [%s] %s%n";
 
    private Subscription publisherSubscription;
 
    final ExecutorService executor = Executors.newFixedThreadPool(4);
    private MySubscription subscription;
    private long DEMAND;
    private ConcurrentLinkedQueue<String> dataItems;
 
    private final CompletableFuture<Void> terminated = new CompletableFuture<>();
 
    public MyProcessor() {
        DEMAND = 0;
        dataItems = new ConcurrentLinkedQueue<String>();
    }
 
    public void setDEMAND(long n) {
        this.DEMAND = n;
    }
 
    @Override
    public void subscribe(Subscriber<? super String> subscriber) {
        subscription = new MySubscription(subscriber, executor);
 
        subscriber.onSubscribe(subscription);
    }
 
    @Override
    public void onSubscribe(Subscription subscription) {
        log("Subscribed...");
 
        publisherSubscription = subscription;
 
        requestItems();
    }
 
    private void requestItems() {
        log("Requesting %d new items...", DEMAND);
        publisherSubscription.request(DEMAND);
    }
 
    @Override
    public void onNext(Integer item) {
 
        if (null == item)
            throw new NullPointerException();
 
        dataItems.add("item value = " + item * 10 + " after processing");
        log("processing item: [" + item + "] ...");
 
    }
 
    @Override
    public void onComplete() {
        log("Complete!");
    }
 
    @Override
    public void onError(Throwable t) {
        log("Error >> %s", t);
    }
 
    private class MySubscription implements Subscription {
 
        private final ExecutorService executor;
 
        private Subscriber<? super String> subscriber;
 
        private AtomicBoolean isCanceled;
 
        public MySubscription(Subscriber<? super String> subscriber, ExecutorService executor) {
            this.executor = executor;
            this.subscriber = subscriber;
 
            isCanceled = new AtomicBoolean(false);
        }
 
        @Override
        public void request(long n) {
            if (isCanceled.get())
                return;
 
            if (n < 0)
                executor.execute(() -> subscriber.onError(new IllegalArgumentException()));
            else if (dataItems.size() > 0)
                publishItems(n);
            else if (dataItems.size() == 0) {
                subscriber.onComplete();
            }
        }
 
        private void publishItems(long n) {
 
            int remainItems = dataItems.size();
 
            if ((remainItems == n) || (remainItems > n)) {
                for (int i = 0; i < n; i++) {
                    executor.execute(() -> {
                        subscriber.onNext(dataItems.poll());
                    });
                }
 
                log("Remaining " + (dataItems.size() - n) + " items to be published to Subscriber!");
            } else if ((remainItems > 0) && (remainItems < n)) {
                for (int i = 0; i < remainItems; i++) {
                    executor.execute(() -> {
                        subscriber.onNext(dataItems.poll());
                    });
                }
                 
                subscriber.onComplete();
            } else {
                log("Processor contains no item!");
            }
 
        }
 
        @Override
        public void cancel() {
            isCanceled.set(true);
 
            shutdown();
            publisherSubscription.cancel();
        }
 
        private void shutdown() {
            log("Shut down executor...");
            executor.shutdown();
            newSingleThreadExecutor().submit(() -> {
 
                log("Shutdown complete.");
                terminated.complete(null);
            });
        }
    }
 
    private void log(String message, Object... args) {
        String fullMessage = String.format(LOG_MESSAGE_FORMAT, currentThread().getName(), message);
 
        System.out.printf(fullMessage, args);
    }
}