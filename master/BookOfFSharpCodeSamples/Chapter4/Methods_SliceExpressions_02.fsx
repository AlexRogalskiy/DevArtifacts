type Sentence(initial : string) =
  let words = initial.Split ' '
  let text = initial
  member x.GetSlice(lower, upper) =
    match defaultArg lower 0 with
    | l when l >= words.Length -> Array.empty<string>
    | l -> match defaultArg upper (words.Length - 1) with
           | u when u >= words.Length -> words.[l..]
           | u -> words.[l..u]
  member x.GetSlice(lower1, upper1, lower2, upper2) =
    x.GetSlice(lower1, upper1)
    |> Array.map
        (fun w -> match defaultArg lower2 0 with
                  | l when l >= w.Length -> ""
                  | l -> match defaultArg upper2 (w.Length - 1) with
                         | u when u >= w.Length -> w.[l..]
                         | u -> w.[l..u])

let s = Sentence "Don't forget to drink your Ovaltine"
let firstTwoChars = s.[1..4, ..1]
