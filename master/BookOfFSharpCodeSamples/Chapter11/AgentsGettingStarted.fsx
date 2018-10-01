#load "__agentsShared.fsx"

open AgentsShared;;

let echoAgent =
  Agent<Message>.Start(fun inbox ->
    let rec loop () =
      async {
        let! (Message(content)) = inbox.Receive()
        printfn "%O" content
        return! loop()
      }
    loop())

Message "nuqneH" |> echoAgent.Post 
Message 123 |> echoAgent.Post 
Message [ 1; 2; 3 ] |> echoAgent.Post


