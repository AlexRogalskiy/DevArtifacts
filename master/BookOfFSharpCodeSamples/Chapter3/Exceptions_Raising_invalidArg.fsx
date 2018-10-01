open System
open System.IO

let filename = "x"

if not (String.IsNullOrEmpty filename) then
  invalidArg "filename" (sprintf "%s is not a valid file name" filename)
