open System
open System.Collections.Generic

type Node(name : string) =
  let children = List<Node>()
  member x.Children with get() = children.AsReadOnly()
  abstract member AddChild : Node -> unit
  abstract member RemoveChild : Node -> unit
  default x.AddChild(n) = children.Add n
  default x.RemoveChild(n) = children.Remove n |> ignore

type TerminalNode(name : string) =
  inherit Node(name)
  [<Literal>]
  let notSupportedMsg = "Cannot add or remove children"
  override x.AddChild(n) = raise (NotSupportedException(notSupportedMsg))
  override x.RemoveChild(n) = raise (NotSupportedException(notSupportedMsg))
