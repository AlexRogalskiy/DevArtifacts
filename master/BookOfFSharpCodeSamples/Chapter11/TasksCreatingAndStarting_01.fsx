open System
open System.Threading.Tasks;;

Parallel.Invoke(
  (fun () -> printfn "Task 1"),
  (fun () -> Task.Delay(100).Wait()
             printfn "Task 2"),
  (fun () -> printfn "Task 3")
);;

printfn "Done";;
