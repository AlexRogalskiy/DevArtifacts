#r "System.Drawing"
// To run this sample, obtain the Regex type provider from NuGet or GitHub (https://github.com/fsprojects/fsharpx)
// and update the path on the next line to reflect its location on your computer.
#r @"..\packages\FSharpx.TypeProviders.Regex.1.8.41\lib\40\FSharpx.TypeProviders.Regex.dll";;

open System
open System.Drawing;;

type colorRegex =
  FSharpx.Regex< @"^#(?<Red>[\dA-F]{2})(?<Green>[\dA-F]{2})(?<Blue>[\dA-F]{2})$">;;

let convertToRgbColor color =
  let inline hexToDec hex = Convert.ToInt32(hex, 16)
  let m = color |> colorRegex().Match
  if m.Success then
    Some (Color.FromArgb(m.Red.Value |> hexToDec,
                         m.Green.Value |> hexToDec,
                         m.Blue.Value |> hexToDec))
  else None;;

[ ""; "#FFFFFF"; "#000000"; "#B0C4DE" ]
|> List.iter
  (convertToRgbColor >>
   (function
    | None -> printfn "Not a color"
    | Some(c) -> printfn "%O" c));;
