#load "__agentsShared.fsx"

open AgentsShared;;

type Operation =
| Add of float
| Subtract of float
| Multiply of float
| Divide of float
| Clear
| Current of AsyncReplyChannel<float>;;

let calcAgent =
  Agent.Start(fun inbox ->
    let rec loop total =
      async {
        let! msg = inbox.Receive()
        let newValue =
          match msg with
          | Add x -> total + x
          | Subtract x -> total - x
          | Multiply x -> total * x
          | Divide x -> total / x
          | Clear -> 0.0
          | Current channel ->
            channel.Reply total
            total
        return! loop newValue }        
    loop 0.0);;

[ Add 10.0
  Subtract 5.0
  Multiply 10.0
  Divide 2.0 ]
|> List.iter (calcAgent.Post);;

calcAgent.PostAndReply(Current) |> printfn "Result: %f"
calcAgent.Post(Clear)
calcAgent.PostAndReply(Current) |> printfn "Result: %f";;
