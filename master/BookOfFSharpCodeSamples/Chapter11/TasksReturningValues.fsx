open System
open System.Threading.Tasks;;

let t = Task.Factory.StartNew(fun () -> System.Random().Next())
t.Result |> printfn "Result: %i";;
