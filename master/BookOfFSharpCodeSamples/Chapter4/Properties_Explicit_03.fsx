type Person() =
  let mutable name = ""
  member x.Name
    with public get() = name
    and internal set(value) = name <- value
