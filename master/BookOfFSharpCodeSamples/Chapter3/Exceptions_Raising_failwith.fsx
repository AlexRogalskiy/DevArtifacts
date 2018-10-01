open System
open System.IO

let filename = "x"

// failwith
if not (File.Exists filename) then
  failwith "File not found"

// failwithf
if not (String.IsNullOrEmpty filename) then
  failwithf "%s could not be found" filename
