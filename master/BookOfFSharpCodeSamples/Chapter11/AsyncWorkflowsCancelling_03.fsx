#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

[| Uri "http://nostarch.com"
   Uri "http://didacticcode.com"
   Uri "http://fsharp.org" |]
|> Array.iter (fun u -> Async.Start(displayPartialPage u));;

Async.CancelDefaultToken();;
