type RgbColor = { R : int; G : int; B : int }
type CmykColor = { C : int; M : int; Y : int; K : int }
type HslColor = { H : int; S : int; L : int }

let detectColorSpace (cs : obj) =
  match cs with
  | :? RgbColor -> printfn "RGB"
  | :? CmykColor -> printfn "CMYK"
  | :? HslColor -> printfn "HSL"
  | _ -> failwith "Unrecognized"
