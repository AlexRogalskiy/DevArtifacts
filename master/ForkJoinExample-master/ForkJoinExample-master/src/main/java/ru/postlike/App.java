package ru.postlike;


import ru.postlike.consumer.ConsumerTask;
import ru.postlike.model.Message;
import ru.postlike.utils.ConsumerUtils;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Buzzlike.ru service prototype
 *
 * Thread execution scheduled by {@code ScheduledExecutorService}
 * then is serviced by {@code ForkJoinPool}
 */
public final class App {

    private final ScheduledExecutorService executorService;
    private static final long attackDelay = 0;
    private static final long delay = 1;
    private static final int CHECKER_NUM_THREADS = 1;

    public static void main(String... args) {
        ConsumerUtils.log("Logging started");
        App consumer = new App();
        consumer.activateConsumer();
    }

    App() {
        executorService = Executors.newScheduledThreadPool(CHECKER_NUM_THREADS);
    }

    void activateConsumer() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(2013, 5, 28);
        Date firstDate = calendar.getTime();
        calendar.set(2013, 5, 29);
        Date secondDate = calendar.getTime();
        Runnable consumerTask = new ConsumerTask(
                new Message.MessageBuilder().setAddressee("test@test.com").setBody("Handshake").setDateOfSend(firstDate).createMessage(),
                new Message.MessageBuilder().setAddressee("supertest1@test.com").setBody("HALO").setDateOfSend(secondDate).createMessage(),
                new Message.MessageBuilder().setAddressee("supertest2@test.com").setBody("HALO1").setDateOfSend(secondDate).createMessage(),
                new Message.MessageBuilder().setAddressee("supertest3@test.com").setBody("HALO2").setDateOfSend(secondDate).createMessage(),
                new Message.MessageBuilder().setAddressee("supertest4@test.com").setBody("HALO3").setDateOfSend(secondDate).createMessage(),
                new Message.MessageBuilder().setAddressee("supertest5@test.com").setBody("HALO4").setDateOfSend(secondDate).createMessage(),
                new Message.MessageBuilder().setAddressee("supertest6@test.com").setBody("HALO5").setDateOfSend(secondDate).createMessage(),
                new Message.MessageBuilder().setAddressee("supertest7@test.com").setBody("HALO6").setDateOfSend(secondDate).createMessage());
        executorService.scheduleWithFixedDelay(consumerTask, attackDelay, delay, TimeUnit.DAYS);
    }
}