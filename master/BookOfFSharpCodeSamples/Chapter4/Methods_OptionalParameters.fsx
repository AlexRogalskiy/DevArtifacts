open System
open System.IO
type Repository() =
  static member Commit (files, desc, ?branch) =
    let targetBranch = defaultArg branch "default"
    printfn "Committed %i files (%s) to \"%s\"" (List.length files) desc targetBranch
