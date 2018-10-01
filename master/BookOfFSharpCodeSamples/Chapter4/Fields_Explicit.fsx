type Person () =
  [<DefaultValue>] val mutable n : string
  member x.Name
    with get() = x.n
    and set(v) = x.n <- v
