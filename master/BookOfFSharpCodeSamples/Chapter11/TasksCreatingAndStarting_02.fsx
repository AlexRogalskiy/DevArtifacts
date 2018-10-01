open System
open System.Threading.Tasks;;

let t = new Task(fun () -> printfn "Manual Task")
t.Start()
t.Wait();;
