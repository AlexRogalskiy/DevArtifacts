using System;
namespace Thompson
{
  class ThompsonProgram
  {
    static void Main(string[] args)
    {
      Console.WriteLine("\nBegin Thompson sampling demo \n");
      Console.WriteLine("Goal is to find best of three machines");
      Console.WriteLine("Machines pay out with probs 0.3, 0.5, 0.7");

      // used to generate graph
      //BetaSampler b = new BetaSampler(0);
      //int[] counts = new int[10];
      //double sum = 0.0;
      //for (int j = 0; j < 10000; ++j)
      //{
      //  double pr = b.Sample(3.0, 1.0);
      //  sum += pr;
      //  if (pr >= 0.9) ++counts[9];
      //  else if (pr >= 0.8) ++counts[8];
      //  else if (pr >= 0.7) ++counts[7];
      //  else if (pr >= 0.6) ++counts[6];
      //  else if (pr >= 0.5) ++counts[5];
      //  else if (pr >= 0.4) ++counts[4];
      //  else if (pr >= 0.3) ++counts[3];
      //  else if (pr >= 0.2) ++counts[2];
      //  else if (pr >= 0.1) ++counts[1];
      //  else ++counts[0];
      //}
      //for (int j = 0; j < counts.Length; ++j)
      //  Console.WriteLine(counts[j]);
      //Console.WriteLine(sum / 10000);
      //Console.ReadLine();

      int N = 3;  // number machines
      double[] means = new double[] { 0.3, 0.5, 0.7 };  // true prob of a win, each machine
      double[] probs = new double[N];  // sampling prob win, each machine
      int[] S = new int[N];  // number successes each machine
      int[] F = new int[N];  // number fails each machine
      //for (int i = 0; i < N; ++i) {  // give each machine 1 win and 1 loss
      //  S[i] = 1; F[i] = 1;
      //}
      Random rnd = new Random(4);  // for machine payouts
      BetaSampler bs = new BetaSampler(2);  // to determine which machine to play

      for (int trial = 0; trial < 10; ++trial)
      {
        Console.WriteLine("\nTrial " + trial.ToString().PadLeft(4));

        // sample prob win, each machine
        for (int i = 0; i < N; ++i) 
          probs[i] = bs.Sample(S[i] + 1.0, F[i] + 1.0);

        Console.Write("sampling probs = ");
        for (int i= 0; i < N; ++i)
          Console.Write(probs[i].ToString("F4") + " ");
        Console.WriteLine("");

        // pick machine with highest sampling prob
        int machine = 0;
        double highProb = 0.0;
        for (int i = 0; i < N; ++i)
        {
          if (probs[i] > highProb)
          {
            highProb = probs[i];
            machine = i;
          }
        }
        Console.Write("Playing machine " + machine);

        // play best sampled machine; update S and F for it
        double p = rnd.NextDouble();  // [0.0, 1.0)
        if (p < means[machine])
        {
          Console.WriteLine(" -- win");
          ++S[machine];  // a success/win!
        }
        else
        {
          Console.WriteLine(" -- lose");
          ++F[machine];  // a failure/loss
        }

      }  // for-trials

      Console.WriteLine("\nFinal sort-of estimates of machine means: ");
      for (int i = 0; i < N; ++i)
      {
        double u = (S[i] * 1.0) / (S[i] + F[i]);  // could throw!
        Console.Write(u.ToString("F4") + "  ");
      }

      Console.WriteLine("\n\nNumber times each machine played:");
      for (int i = 0; i < N; ++i)
      {
        int ct = S[i] + F[i];
        Console.Write(ct + "  ");
      }

      Console.WriteLine("\n\nEnd demo ");
      Console.ReadLine();

    } // Main

  } // Program class

  public class BetaSampler
  {
    // the "BA" algorithm
    // R.C.H. Cheng, "Generating Beta Variates with Nonintegral Shape Parameters"
    // Communications of the ACM, April 1978, vol 21, No 4, pp 317-322
    public Random rnd;
    public BetaSampler(int seed)
    {
      this.rnd = new Random(seed);
    }
    public double Sample(double a, double b)
    {
      // a, b > 0
      double alpha = a + b;
      double beta = 0.0;
      double u1, u2, w, v = 0.0;
 
      if (Math.Min(a, b) <= 1.0)
        beta = Math.Max(1 / a, 1 / b);
      else
        beta = Math.Sqrt((alpha - 2.0) / (2 * a * b - alpha));
      double gamma = a + 1 / beta;

      while (true)
      {
        u1 = this.rnd.NextDouble();
        u2 = this.rnd.NextDouble();
        v = beta * Math.Log(u1 / (1 - u1));
        w = a * Math.Exp(v);
        double tmp = Math.Log(alpha / (b + w));
        if (alpha * tmp + (gamma * v) - 1.3862944 >= Math.Log(u1 * u1 * u2))
          break;
      }

      double x = w / (b + w);
      return x;
    } // Sample
  }  // BetaSampler
} // ns
