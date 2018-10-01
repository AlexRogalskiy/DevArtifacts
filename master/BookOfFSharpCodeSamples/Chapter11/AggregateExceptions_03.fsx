#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

let html =
  Uri "http://nostarch.com"
  |> getPage
  |> Async.RunSynchronously;;
