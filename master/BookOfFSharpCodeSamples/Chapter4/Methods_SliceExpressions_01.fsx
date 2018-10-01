type Sentence(initial : string) =
  let words = initial.Split ' '
  let text = initial
  member x.GetSlice(lower, upper) =
    match defaultArg lower 0 with
    | l when l >= words.Length -> Array.empty<string>
    | l -> match defaultArg upper (words.Length - 1) with
           | u when u >= words.Length -> words.[l..]
           | u -> words.[l..u]

let s = Sentence "Don't forget to drink your Ovaltine"
let middleWords = s.[1..3]
let firstWords = s.[..3]
let lastWords = s.[3..]
