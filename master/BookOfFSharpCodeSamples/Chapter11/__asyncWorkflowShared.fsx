module AsyncWorkflowShared

open System
open System.IO
open System.Net
open System.Text.RegularExpressions

// Type extension adapted from the F# PowerPack
type StreamReader with
  member x.AsyncReadToEnd () =
    async { do! Async.SwitchToNewThread()
            let content = x.ReadToEnd()
            do! Async.SwitchToThreadPool()
            return content }

let getPage (uri : Uri) = 
  async {
    let req = WebRequest.Create uri
    use! response = req.AsyncGetResponse()
    use stream = response.GetResponseStream()
    use reader = new StreamReader(stream)
    return! reader.AsyncReadToEnd()
  }

let displayPartialPage uri =
  Async.TryCancelled(
    async {
      let! c = getPage uri
      Regex.Replace(c.Substring(0, 50), @"[\r\n]| {2,}", "")
      |> sprintf "[%O] %s..." uri
      |> Console.WriteLine },
    (sprintf "[%O] Cancelled: %O" uri >> Console.WriteLine))
