type Container() =
  member x.Fill ?stopAtPercent =
    printfn "%s" <| match (defaultArg stopAtPercent 0.5) with
                    | 1.0 -> "Filled it up"
                    | stopAt -> sprintf "Filled to %s" (stopAt.ToString("P2"))
