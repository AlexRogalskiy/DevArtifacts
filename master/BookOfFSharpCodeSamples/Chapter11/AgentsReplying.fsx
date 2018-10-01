#load "__agentsShared.fsx"

open AgentsShared;;

let echoAgent3 =
  Agent.Start(fun inbox ->
    let rec loop () =
      async {
        let! (ReplyMessage(m, c)) = inbox.Receive()
        c.Reply m
        return! loop()
      }
    loop())

echoAgent3.PostAndReply(fun c -> ReplyMessage("hello", c))
|> printfn "Response: %O"
