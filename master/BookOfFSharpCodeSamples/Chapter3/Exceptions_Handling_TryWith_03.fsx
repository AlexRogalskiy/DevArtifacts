open System
open System.IO

try
  use file = File.OpenText "somefile.txt"
  file.ReadToEnd() |> printfn "%s"
with
| :? FileNotFoundException as ex -> printfn "%s was not found" ex.FileName
| :? PathTooLongException
| :? ArgumentNullException
| :? ArgumentException -> printfn "Invalid filename"
| _ -> printfn "Error loading file"