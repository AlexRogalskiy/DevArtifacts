open System
open System.Threading.Tasks;;

let antecedents =
  [|
    new Task(
      fun () ->
        Console.WriteLine("Started first antecedent")
        System.Threading.Thread.Sleep(1000)
        Console.WriteLine("Completed first antecedent"))
    new Task(
      fun () ->
        Console.WriteLine("Started second antecedent")
        System.Threading.Thread.Sleep(1250)
        Console.WriteLine("Completed second antecedent"))
    new Task(
      fun () ->
        Console.WriteLine("Started third antecedent")
        System.Threading.Thread.Sleep(1000)
        Console.WriteLine("Completed third antecedent"))
  |];;

let continuation =
  Task.Factory.ContinueWhenAll(
    antecedents,
    fun (a : Task array) ->
      Console.WriteLine("Started continuation")
      for x in a do Console.WriteLine("Antecedent status: {0}", x.Status)
      Console.WriteLine("Completed continuation"));;

for a in antecedents do a.Start();;

Console.WriteLine("Waiting for continuation")
continuation.Wait()
Console.WriteLine("Done");;
