package ru.postlike.consumer;

import ru.postlike.forkJoin.RecursiveMailSender;
import ru.postlike.model.Message;
import ru.postlike.utils.ConsumerUtils;

import java.util.Arrays;
import java.util.List;

import java.util.concurrent.ForkJoinPool;

public class ConsumerTask implements Runnable {
    private List<Message> messagesList;

    public ConsumerTask(Message... msg) {
        messagesList = Arrays.asList(msg);
    }

    public void run() {
        //Count the postponed tasks using DAO
        //#TODO DAO

        // submit the task to the pool
        int parallelism = Runtime.getRuntime().availableProcessors();
        ConsumerUtils.log("Runtime.getRuntime().availableProcessors() = " + parallelism);
        final ForkJoinPool pool = new ForkJoinPool(parallelism);
        final RecursiveMailSender finder = new RecursiveMailSender(messagesList);
        //Send tasks to fork/join pool
        pool.invoke(finder);
    }
}