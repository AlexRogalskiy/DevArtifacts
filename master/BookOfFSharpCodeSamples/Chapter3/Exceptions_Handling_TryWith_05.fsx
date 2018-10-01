open System
open System.Diagnostics
open System.IO

let fileContents =
  try
    use file = File.OpenText "somefile.txt"
    Some <| file.ReadToEnd()
  with
  | :? FileNotFoundException as ex ->
    printfn "%s was not found" ex.FileName
    None
  | _ ->
    printfn "Error loading file"
    reraise()
