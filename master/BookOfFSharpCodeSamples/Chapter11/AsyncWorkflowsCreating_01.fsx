#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

async {
  let! content = Uri "http://nostarch.com" |> getPage
  content.Substring(0, 50) |> printfn "%s" }
|> Async.Start;;
