open System
open System.Threading.Tasks;;

let t = Task.Factory.StartNew(fun () -> printfn "Factory Task")
t.Wait();;
