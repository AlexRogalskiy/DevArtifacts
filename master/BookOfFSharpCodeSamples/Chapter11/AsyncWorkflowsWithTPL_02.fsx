#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

let getPageAsync (uri : string) =
  async {
    use client = new System.Net.WebClient()
    return! Async.AwaitTask (client.DownloadStringTaskAsync uri)
  };;

async {
  let! result = getPageAsync "http://nostarch.com"
  result.Substring(0, 50) |> printfn "%s"
} |> Async.Start;;
