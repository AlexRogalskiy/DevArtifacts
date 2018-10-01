#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

open System.Text.RegularExpressions;;

[| getPage(Uri "http://nostarch.com")
   getPage(Uri "http://microsoft.com")
   getPage(Uri "http://fsharp.org") |]
|> Async.Parallel
|> Async.RunSynchronously
|> Seq.iter (fun c -> let sample = c.Substring(0, 50)
                      Regex.Replace(sample, @"[\r\n]| {2,}", "")
                      |> printfn "%s...");;
