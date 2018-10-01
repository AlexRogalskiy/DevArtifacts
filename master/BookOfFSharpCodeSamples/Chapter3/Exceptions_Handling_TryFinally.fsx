open System.IO

try
  use file = File.OpenText "somefile.txt"
  Some <| file.ReadToEnd()
finally
  printfn "cleaning up"
