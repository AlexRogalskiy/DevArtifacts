type Person (name, age) =
  do printfn "Creating person: %s (Age: %i)" name age
  new (name) = Person(name, 0)
  new () = Person("")
  member x.Name = name
  member x.Age = age
