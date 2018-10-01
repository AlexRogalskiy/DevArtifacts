open System.IO

try
  use file = File.OpenText "somefile.txt"
  file.ReadToEnd() |> printfn "%s"
with
| :? FileNotFoundException -> printfn "File not found"
| _ -> printfn "Error loading file"
