type Person (name, age) =
  do printfn "Creating person: %s (Age: %i)" name age
  new (name) = Person(name, 0)
               then printfn "Creating person with default age"
  new () = Person("")
           then printfn "Creating person with default name and age"
  member x.Name = name
  member x.Age = age
