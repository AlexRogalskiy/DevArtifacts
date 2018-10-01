#load "__agentsShared.fsx"

open AgentsShared;;

let echoAgent2 =
  Agent<Message>.Start(fun inbox ->
    let rec loop () =
      inbox.Scan(fun (Message(x)) ->
        match x with
        | :? string
        | :? int ->
          Some (async { printfn "%O" x
                        return! loop() })
        | _ -> printfn "<not handled>"; None)
    loop());;

Message "nuqneH" |> echoAgent2.Post;;
Message 123 |> echoAgent2.Post;;
Message [ 1; 2; 3 ] |> echoAgent2.Post;;
echoAgent2.CurrentQueueLength;;
