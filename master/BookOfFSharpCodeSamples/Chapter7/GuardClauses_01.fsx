let testNumber value =
    match value with
    | v when v < 0 -> printfn "%i is negative" v
    | v when v > 0 -> printfn "%i is positive" v
    | _ -> printfn "zero"
