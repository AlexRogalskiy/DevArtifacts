#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

Uri "http://nostarch.com"
|> getPage
|> Async.StartAsTask
|> (fun t -> t.Result.Substring(0, 50))
|> printfn "%s";;
