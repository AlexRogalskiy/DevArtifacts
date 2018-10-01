#load "__asyncWorkflowShared.fsx"

open System
open AsyncWorkflowShared;;

let getPageSafe uri =
  async {
    try
      let! content = getPage uri
      return Some content
    with
    | :? NotSupportedException as ex ->
      Console.WriteLine "Caught NotSupportedException"
      return None
    | :? OutOfMemoryException as ex ->
      Console.WriteLine "Caught OutOfMemoryException"
      return None
    | ex ->
      ex |> sprintf "Caught general exception: %O" |> Console.WriteLine
      return None };;

getPageSafe (Uri "http://nostarch.com");;
