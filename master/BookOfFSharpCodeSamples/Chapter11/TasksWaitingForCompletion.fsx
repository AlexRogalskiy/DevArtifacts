open System
open System.Threading.Tasks;;

let randomWait (delayMs : int) (msg : string) =
  fun () -> (System.Random().Next delayMs |> Task.Delay).Wait()
            Console.WriteLine msg;;

let waitTask = Task.Factory.StartNew(randomWait 1000 "Task Finished")
waitTask.Wait()
printfn "Done Waiting";;

Task.WaitAny(
    Task.Factory.StartNew(randomWait 2000 "Task 0 Finished"),
    Task.Factory.StartNew(randomWait 2000 "Task 1 Finished"),
    Task.Factory.StartNew(randomWait 2000 "Task 2 Finished"))
Console.WriteLine "Done Waiting";;
