#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared
open System.Threading;;

let tokens =
  [| Uri "http://nostarch.com"
     Uri "http://didacticcode.com"
     Uri "http://fsharp.org" |]
  |> Array.map (fun u -> let ts = new CancellationTokenSource()
                         Async.Start(displayPartialPage u, ts.Token)
                         ts);;
tokens.[0].Cancel()
tokens.[1].Cancel();;
