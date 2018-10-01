type Person (name, age) as ``This is a bad identifier`` =
  do
    printfn "Creating person: %s (Age: %i)"
      ``This is a bad identifier``.Name
      ``This is a bad identifier``.Age
  member x.Name = name
  member x.Age = age
