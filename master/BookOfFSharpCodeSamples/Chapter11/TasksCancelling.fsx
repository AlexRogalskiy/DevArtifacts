open System
open System.Threading.Tasks;;

let taskWithCancellation (cancelDelay : int) (taskDelay : int) =
  use tokenSource = new System.Threading.CancellationTokenSource(cancelDelay)
  let token = tokenSource.Token

  try
    let t =
      Task.Factory.StartNew(
        (fun () ->
          token.ThrowIfCancellationRequested()
          printfn "passed cancellation check; waiting"
          System.Threading.Thread.Sleep taskDelay
          token.ThrowIfCancellationRequested()
          ),
        token
      )
    t.Wait()
  with
  | ex -> printfn "%O" ex
  printfn "Done";;

taskWithCancellation 1000 3000;;

