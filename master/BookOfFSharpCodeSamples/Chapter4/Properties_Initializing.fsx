type Person() =
  member val Name = "" with get, set

let p = Person(Name = "Dave")
