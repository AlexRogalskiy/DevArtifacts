open System
open System.Threading.Tasks;;

let parallelForWithCancellation (wait : int) =
  use tokenSource = new System.Threading.CancellationTokenSource(wait)

  try
    Parallel.For(
      0,
      Int32.MaxValue,
      ParallelOptions(CancellationToken = tokenSource.Token),
      fun (i : int) -> Console.WriteLine i
    ) |> ignore
  with
  | :? OperationCanceledException -> printfn "Cancelled!"
  | ex -> printfn "%O" ex;;

parallelForWithCancellation 100;;
