open System.IO

let filename = "x"
if not (File.Exists filename) then
  raise <| FileNotFoundException("filename was null or empty")
