package ru.postlike.forkJoin;

import ru.postlike.model.Message;
import ru.postlike.utils.ConsumerUtils;

import java.util.List;
import java.util.concurrent.RecursiveAction;

/**
 * ForkJoinPool
 */
public class RecursiveMailSender extends RecursiveAction {

    private static final int SEQUENTIAL_THRESHOLD = 5;
    private final List<Message> data;
    private final int start;
    private final int end;

    public RecursiveMailSender(List<Message> data, int start, int end) {
        this.data = data;
        this.start = start;
        this.end = end;
    }

    public RecursiveMailSender(List<Message> data) {
        this(data, 0, data.size());
    }

    @Override
    protected void compute() {
        final int length = end - start;
        if (length < SEQUENTIAL_THRESHOLD) {
            computeDirectly();
        } else {
            int split = length / 2;
            invokeAll(new RecursiveMailSender(data, start, start + split), new RecursiveMailSender(data, start + split, end));
        }
    }

    private void computeDirectly() {
       ConsumerUtils.log(Thread.currentThread() + " computing: " + start
                + " to " + end);
        for (int i = start; i < end; i++) {
            ConsumerUtils.log(data.get(i).getAddressee());
            ConsumerUtils.sendAnEmail(data.get(i).getAddressee(), data.get(i).getBody());
        }
    }
}