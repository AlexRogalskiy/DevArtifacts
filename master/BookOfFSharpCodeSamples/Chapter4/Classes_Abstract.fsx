[<AbstractClass>]
type Node(name : string, ?content : Node list) =
  member x.Name = name
  member x.Content = content
