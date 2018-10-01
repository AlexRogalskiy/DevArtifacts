type Person () =
  let mutable name : string = ""
  member x.Name
    with get() = name
    and set(v) = name <- v
