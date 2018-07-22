import edu.princeton.cs.algs4.WeightedQuickUnionUF;

public class Percolation {
	
	private final WeightedQuickUnionUF tree;
	private boolean[] grid;
	private final int length;
	private final int gridSize;
	
   public Percolation(int n)
   {
	   if (n < 1) {
		   throw new IllegalArgumentException("Grid size cannot be less than 1 x 1");
	   }
	   
	   length = n;
	   gridSize = length * length + 2;
	   tree = new WeightedQuickUnionUF(gridSize);
	   grid = new boolean[gridSize];
	   
   }
   
   public void open(int row, int col)
   {
	   // need to handle connection to 0 and final row
	   assertSiteInRange(row, col);
	   
	   if (!isOpen(row, col)) {
		   
		   int site = findSite(row, col);
		   grid[site] = true;
		   
		   // left neighbour
		   connectNeighbour(site, row, col - 1);
		    
		   // right neighbour
		   connectNeighbour(site, row, col + 1);
		   
		   // top neighbour
		   if (row - 1 == 0) {
			   tree.union(site, 0);
		   } else {
			   connectNeighbour(site, row - 1, col);
		   }
		   
		   // bottom neighbour
		   if (row == length) {
			   tree.union(site, gridSize - 1);
		   } else {
			   connectNeighbour(site, row + 1, col);
		   }
	   }
   }
   
   private void connectNeighbour(int site, int row, int col)
   {
	   if (inRange(row, col) && isSiteOpen(row, col)) {
		   tree.union(site, findSite(row, col));
	   }
   }
   
   private void assertSiteInRange(int row, int col)
   {
	   if (!inRange(row, col)) {
		   throw new IllegalArgumentException("Row " + row + " and col " + col + " not in range.");
	   }
   }
   
   private boolean inRange(int row, int col)
   {
	   return inRange(row) && inRange(col);
   }
   
   
   private boolean inRange(int position)
   {
	   return position > 0 && position <= length;
   }
   
   private boolean isSiteOpen(int row, int col)
   {
	   return grid[findSite(row, col)];
   }
   
   public boolean isOpen(int row, int col)
   {
	   assertSiteInRange(row, col);
	   return isSiteOpen(row, col);
   }
   
   public boolean isFull(int row, int col)
   {
	   assertSiteInRange(row, col);
	   return tree.connected(0, findSite(row, col));
   }
   
   public int numberOfOpenSites()
   {
	   int openSites = 0;
	   for (int i = 0; i < grid.length - 1; i++) {
		   if (grid[i]) {
			   openSites++;
		   }
	   }
	   return openSites;
   }
   
   public boolean percolates()
   {
	   return tree.connected(0, gridSize - 1);
   }
   
   private int findSite(int row, int col)
   {
	   return length * (row - 1) + col;
   }
}