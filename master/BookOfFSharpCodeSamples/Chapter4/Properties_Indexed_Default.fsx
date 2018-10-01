type Sentence(initial : string) =
  let mutable words = initial.Split ' '
  let mutable text = initial
  member x.Item
    with get i = words.[i]
    and set i v =
      words.[i] <- v
      text <- System.String.Join(" ", words)

let s = Sentence "Don't forget to drink your Ovaltine"
s.[1] <- "remember"
