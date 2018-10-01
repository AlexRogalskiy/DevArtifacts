open System
open System.Collections.Concurrent
open System.Threading.Tasks

let antecedent =
  new Task<string>(
    fun () -> 
      Console.WriteLine("Started antecedent")
      System.Threading.Thread.Sleep(1000)
      Console.WriteLine("Completed antecedent")
      "Job's done")

let continuation =
  antecedent.ContinueWith(
    fun (a : Task<string>) ->
      Console.WriteLine("Started continuation")
      Console.WriteLine("Antecedent status: {0}", a.Status)
      Console.WriteLine("Antecedent result: {0}", a.Result)
      Console.WriteLine("Completed continuation"))

antecedent.Start()
Console.WriteLine("Waiting for continuation")
continuation.Wait()
Console.WriteLine("Done")
