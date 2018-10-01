open System

type Person (name : string, dob : System.DateTime) =
  let age = (System.DateTime.Now - dob).TotalDays / 365.25
  do printfn "Creating person: %s (Age: %f)" name age
  member x.Name = name
  member x.DateOfBirth = dob
  member x.Age = age
