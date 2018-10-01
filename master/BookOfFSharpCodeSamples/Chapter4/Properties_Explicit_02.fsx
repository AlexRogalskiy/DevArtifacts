type Person() =
  let mutable name = ""
  member x.Name with get() = name
  member x.Name with set(value) = name <- value
