open System
open System.Collections.Concurrent
open System.Threading.Tasks;;

let shortCircuitExample shortCircuit =
  let bag = ConcurrentBag<_>()
  Parallel.For(
    0,
    999999,
    fun i s -> if i < 10000 then bag.Add i else shortCircuit s) |> ignore
  (bag, bag.Count);;

shortCircuitExample (fun s -> s.Break()) |> printfn "%A";;
shortCircuitExample (fun s -> s.Stop()) |> printfn "%A";;
