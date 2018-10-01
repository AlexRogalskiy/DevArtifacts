open System
open System.IO

type Repository() =
  member x.Commit(files, desc, branch) =
    printfn "Committed %i files (%s) to \"%s\"" (List.length files) desc branch
  member x.Commit(files, desc) =
    x.Commit(files, desc, "default")
