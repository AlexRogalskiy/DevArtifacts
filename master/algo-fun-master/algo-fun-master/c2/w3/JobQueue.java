import java.io.*;
import java.util.StringTokenizer;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Comparator;

public class JobQueue {
    private int numWorkers;
    private int[] jobs;

    private int[] assignedWorker;
    private long[] startTime;

    private FastScanner in;
    private PrintWriter out;

    public static void main(String[] args) throws IOException {
        new JobQueue().solve();
    }

    private void readData() throws IOException {
        numWorkers = in.nextInt();
        int m = in.nextInt();
        jobs = new int[m];
        for (int i = 0; i < m; ++i) {
            jobs[i] = in.nextInt();
        }
    }

    private void writeResponse() {
        for (int i = 0; i < jobs.length; ++i) {
            out.println(assignedWorker[i] + " " + startTime[i]);
        }
    }

    class Worker {
        int id;
        int nextFreeTime;
        public Worker(int id) {
            this.id=id;
            this.nextFreeTime=0;
        }
    }

    private void assignJobs() {
        // TODO: replace this code with a faster algorithm.
        assignedWorker = new int[jobs.length];
        startTime = new long[jobs.length];
        Queue<Worker> pq = new PriorityQueue<>(numWorkers, new Comparator<Worker>() {
                @Override
            public int compare (Worker w1, Worker w2) {
                return w1.nextFreeTime==w2.nextFreeTime ? w1.id-w2.id : (int) (w1.nextFreeTime - w2.nextFreeTime);
            }

        });
        for (int i=0; i < numWorkers; i++) {
            pq.add(new Worker(i));
        }
        // long[] nextFreeTime = new long[numWorkers];
        for (int i = 0; i < jobs.length; i++) {
            int duration = jobs[i];
            Worker availableWorker= pq.poll();
            // int bestWorker = availableWorker.id;
            // for (int j = 0; j < numWorkers; ++j) {
                // if (nextFreeTime[j] < nextFreeTime[bestWorker])
                    // bestWorker = j;
            // }
            assignedWorker[i] = availableWorker.id;
            startTime[i] = availableWorker.nextFreeTime;
            availableWorker.nextFreeTime+=duration;
            pq.add(availableWorker);
            // nextFreeTime[bestWorker] += duration;
        }
    }

    public void solve() throws IOException {
        in = new FastScanner();
        out = new PrintWriter(new BufferedOutputStream(System.out));
        readData();
        assignJobs();
        writeResponse();
        out.close();
    }

    static class FastScanner {
        private BufferedReader reader;
        private StringTokenizer tokenizer;

        public FastScanner() {
            reader = new BufferedReader(new InputStreamReader(System.in));
            tokenizer = null;
        }

        public String next() throws IOException {
            while (tokenizer == null || !tokenizer.hasMoreTokens()) {
                tokenizer = new StringTokenizer(reader.readLine());
            }
            return tokenizer.nextToken();
        }

        public int nextInt() throws IOException {
            return Integer.parseInt(next());
        }
    }
}
