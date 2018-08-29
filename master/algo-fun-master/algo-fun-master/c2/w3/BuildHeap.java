import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.StringTokenizer;

public class BuildHeap {
    private int[] data;
    private int[] data2;
    private List<Swap> swaps;
    private int size;
    private int maxSize;
    private FastScanner in;
    private PrintWriter out;

    public static void main(String[] args) throws IOException {
        new BuildHeap().solve();
    }

    private void readData() throws IOException {
        int n = in.nextInt();
        data = new int[n];
        for (int i = 0; i < n; ++i) {
          data[i] = in.nextInt();
        }
        this.maxSize=data.length+3;  
    }

    private void writeResponse() {
        out.println(swaps.size());
        for (Swap swap : swaps) {
          out.println(swap.index1 + " " + swap.index2);
        }
    }

        int parent(int i) {
            return i/2;
            
        }

        int leftChild(int i) {
            return 2*i;
        }

        int rightChild(int i) {
            return 2*i+1;
        }

        // void swap(int source, int dest) {
        //     int buff = parent[dest];

        //     parent[dest]= source;
        //     parent[source] = buff;
        // }

        void siftUp(int i) {
            while (i>1 && parent(i) < data2[i]) {
                swaps.add(new Swap(parent(i), i));
                // swap (parent(i), parent[i]);
                i=parent(i);
            }
        }

        void siftDown(int i) {
            int maxIndex=i;
            int l = leftChild(i);

            if (l<= this.size && data[l]>data2[maxIndex]) {
                maxIndex=l; 
            }

            int r=rightChild(i);
            if (r<= this.size && data[r]>data2[maxIndex]) {
                maxIndex=r; 
            }

            if (i!=maxIndex) {
                swaps.add(new Swap(i, maxIndex));
                // swap(i, maxIndex);
                siftDown(maxIndex);
            }
        }

        void insert(int p ){
            if (this.size==this.maxSize) {
                throw new RuntimeException();
            }
            this.size++;
            data2[this.size]=p;
            siftUp(size);   
        }

        int extract(){
            int result=data[0];
            data[0]=data2[this.size];
            this.size--;
            siftDown(0);
            return result;
        }

        void remove(int i) {
            data2[i]=Integer.MAX_VALUE;
            siftUp(i);
            extract();
        }


    private void generateSwaps() {
      swaps = new ArrayList<Swap>();
      this.data2= new int[data.length+1];
      for (int i: data) {
           insert(i); 
      }
      // The following naive implementation just sorts 
      // the given sequence using selection sort algorithm
      // and saves the resulting sequence of swaps.
      // This turns the given array into a heap, 
      // but in the worst case gives a quadratic number of swaps.
      //
      // TODO: replace by a more efficient implementation
      // for (int i = 0; i < data.length; ++i) {
      //   for (int j = i + 1; j < data.length; ++j) {
      //     if (data[i] > data[j]) {
      //       swaps.add(new Swap(i, j));
      //       int tmp = data[i];
      //       data[i] = data[j];
      //       data[j] = tmp;
      //     }
      //   }
      // }
    }

    public void solve() throws IOException {
        in = new FastScanner();
        out = new PrintWriter(new BufferedOutputStream(System.out));
        readData();
        generateSwaps();
        writeResponse();
        out.close();
    }

    static class Swap {
        int index1;
        int index2;

        public Swap(int index1, int index2) {
            this.index1 = index1;
            this.index2 = index2;
        }
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
