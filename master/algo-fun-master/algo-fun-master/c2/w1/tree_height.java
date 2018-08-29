import java.util.*;
import java.io.*;

public class tree_height {

    class Node {
    	List<Node> children = new ArrayList<Node>();
    	void addChildren(Node elem) {
    		children.add(elem);
    	}

    	@Override
    	public String toString() {
    		return children.toString();
    	}
    }

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
		List<Node> nodes = new ArrayList<Node>();
		int root;
		
		void read() throws IOException {
			FastScanner in = new FastScanner();
			n = in.nextInt();
			int[] indexes = new int[n];
			// nodes=new Node[n];
			for (int i = 0; i < n; i++) {
				int parentIndex=in.nextInt();
				indexes[i] = parentIndex;					
				nodes.add(i, new Node());
			}
			System.out.println(3);

			for (int i = 0; i < n; i++) {
				int parentIndex=indexes[i];
				if (parentIndex == -1) {
					root=i;
				} else {
					nodes.get(parentIndex).addChildren(nodes.get(i));
				}
			}
		



		}

		int computeHeight() {
				int max=0;
			for (Node i : nodes) {
				max=Math.max(i.children.size()+1, max);
				// if (Math.max(i.children.size> max) {
				// 	max=
				// }
			}
			return max;	
		}
  //                       // Replace this code with a faster implementation
		// 	int maxHeight = 0;
		// 	for (int vertex = 0; vertex < n; vertex++) {
		// 		int height = 0;
		// 		for (int i = vertex; i != -1; i = parent[i])
		// 			height++;
		// 		maxHeight = Math.max(maxHeight, height);
		// 	}
		// 	return maxHeight;
		// }
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
		System.out.println("root " + tree.root);
		// System.out.println("nodes "+ Arrays.toString(tree.nodes));
		tree.nodes.forEach(name -> System.out.println(name));
		// System.out.println("nodes "+ Arrays.toString(tree.nodes));
		System.out.println(tree.computeHeight());
	}
}
