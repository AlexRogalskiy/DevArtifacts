
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdStats;

public class PercolationStats {
		
		private static final double CONFIDENCE95 = 1.95;
		private final double[] trialProbabilities;
		private final int numberOfTrials;
		private double mean = -1;
		private double stddev = -1;
		
	   public PercolationStats(int n, int trials)
	   {
		   if (trials < 1 || n < 1) {
			   throw new IllegalArgumentException("Trials and n cannot be less than 1");
		   }
		   numberOfTrials = trials;
		   trialProbabilities = new double[numberOfTrials];
		   
		   for (int i = 0; i < numberOfTrials; i ++) {
			   Percolation perc = new Percolation(n);
			   
			   while (!perc.percolates()) {
				   perc.open(StdRandom.uniform(n) + 1, StdRandom.uniform(n) + 1);
			   }
			   
			   trialProbabilities[i] = (double) perc.numberOfOpenSites() / (double)(n * n);
		   }
		   
	   }
	   
	   public double mean()
	   {
		   if (mean == -1) {
			   mean = StdStats.mean(trialProbabilities);
		   }
		   
		   return mean;
	   }
	   
	   public double stddev()
	   {
		   if (stddev == -1) {
			   stddev = StdStats.stddev(trialProbabilities);
		   }
		   
		   return stddev; 
	   }
	   
	   public double confidenceLo()
	   {
		   return mean() - confidenceInterval();
	   }
	   
	   public double confidenceHi()
	   {
		   return mean() + confidenceInterval();
	   }
	   
	   private double confidenceInterval()
	   {
		   return CONFIDENCE95 * (stddev() / numberOfTrials);
	   }
	   
	   public static void main(String[] args)
	   {
		   PercolationStats stats = new PercolationStats(Integer.parseInt(args[0]), Integer.parseInt(args[1]));
		   System.out.print(stats.mean());
		   System.out.print(stats.stddev());
		   System.out.print(stats.confidenceLo());
		   System.out.print(stats.confidenceHi());
	   }
}
