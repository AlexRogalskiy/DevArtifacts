import java.util.*;
import java.io.*;

public class tree_height_new {
    class FastScanner {
		StringTokenizer tok = new StringTokenizer("");
		BufferedReader in;

		FastScanner() {
			in = new BufferedReader(new InputStreamReader(System.in));
		}

		String next() throws IOException {
			while (!tok.hasMoreElements())
				tok = new StringTokenizer(in.readLine());
			return tok.nextToken();
		}
		int nextInt() throws IOException {
			return Integer.parseInt(next());
		}
	}

	public class TreeHeight {
		int n;
		int parent[];
		int maxSize;
		int size;

		
		void read() throws IOException {
			FastScanner in = new FastScanner();
			n = in.nextInt();
			parent = new int[n];
			for (int i = 0; i < n; i++) {
				parent[i] = in.nextInt();
			}
			this.size=parent.length;
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

		void swap(int source, int dest) {
			int buff = parent[dest];

			parent[dest]= source;
			parent[source] = buff;
		}

		void siftUp(int i) {
			while (i>1 && parent(i) < parent[i]) {
				swap (parent(i), parent[i]);
				i=parent(i);
			}
		}

		void siftDown(int i) {
			int maxIndex=i;
			int l = leftChild(i);

			if (l<= this.size && parent[l]>parent[maxIndex]) {
				maxIndex=l;	
			}

			int r=rightChild(i);
			if (r<= this.size && parent[r]>parent[maxIndex]) {
				maxIndex=r;	
			}

			if (i!=maxIndex) {
				swap(i, maxIndex);
				siftDown(maxIndex);
			}
		}

		void insert(int p ){
			if (this.size==this.maxSize) {
				throw new RuntimeException();
			}
			this.size++;
			parent[this.size]=p;
			siftUp(size);	
		}

		int extract(){
			int result=parent[1];
			parent[1]=parent[this.size];
			this.size--;
			siftDown(1);
			return result;
		}

		void remove(int i) {
			parent[i]=Integer.MAX_VALUE;
			siftUp(i);
			extract();
		}

		int computeHeight() {
                        // Replace this code with a faster implementation
			int maxHeight = 0;
			for (int vertex = 0; vertex < n; vertex++) {
				int height = 0;
				for (int i = vertex; i != -1; i = parent[i])
					height++;
				maxHeight = Math.max(maxHeight, height);
			}
			return maxHeight;
		}
	}

	static public void main(String[] args) throws IOException {
            new Thread(null, new Runnable() {
                    public void run() {
                        try {
                            new tree_height().run();
                        } catch (IOException e) {
                        }
                    }
                }, "1", 1 << 26).start();
	}
	public void run() throws IOException {
		TreeHeight tree = new TreeHeight();
		tree.read();
		System.out.println(tree.computeHeight());
	}
}
