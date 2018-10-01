#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

Async.StartWithContinuations(
  getPage(Uri "http://nostarch.com"),
  (fun c -> c.Substring(0, 50) |> printfn "%s..."),
  (printfn "Exception: %O"),
  (fun _ -> printfn "Cancelled")
);;
