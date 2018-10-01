type Person() =
  let mutable name = ""
  member x.Name
    with get() = name
    and set(value) = name <- value

let me = Person()
me.Name <- "Dave"
