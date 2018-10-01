type Person (name, age) as this =
  do printfn "Creating person: %s (Age: %i)" this.Name this.Age
  member x.Name = name
  member x.Age = age
