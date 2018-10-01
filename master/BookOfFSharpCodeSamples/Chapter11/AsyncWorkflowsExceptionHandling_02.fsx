#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

Uri "http://nostarch.com"
|> getPage
|> Async.Catch
|> Async.RunSynchronously
|> function
   | Choice1Of2 result -> Some result
   | Choice2Of2 ex ->
      match ex with
      | :? NotSupportedException ->
        Console.WriteLine "Caught NotSupportedException"
      | :? OutOfMemoryException ->
        Console.WriteLine "Caught OutOfMemoryException"
      | ex ->
        ex.Message |> sprintf "Exception: %s" |> Console.WriteLine
      None;;
