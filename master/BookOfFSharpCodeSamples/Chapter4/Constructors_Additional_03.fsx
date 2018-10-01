type Person =
  val _name : string
  val _age : int
  new (name, age) = { _name = name; _age = age }
  new (name) = Person(name, 0)
  new () = Person("")
  member x.Name = x._name
  member x.Age = x._age
