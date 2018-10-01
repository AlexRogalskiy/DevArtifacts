﻿// This example differs slightly from the book text because the project is an
// F# script rather than a stand-alone F# application. To execute this code,
// Send it to F# Interactive by selecting the code and pressing ALT + ENTER

module RpnCalculator =
  open System

  let evalRpnExpr (s : string) =
    let solve items current =
      match (current, items) with
      | "+", y::x::t -> (x + y)::t
      | "-", y::x::t -> (x - y)::t
      | "*", y::x::t -> (x * y)::t
      | "/", y::x::t -> (x / y)::t
      | _ -> (float current)::items
    (s.Split(' ') |> Seq.fold solve []).Head

open RpnCalculator

[ "4 2 5 * + 1 3 2 * + /"
  "5 4 6 + /"
  "10 4 3 + 2 * -"
  "2 3 +"
  "90 34 12 33 55 66 + * - + -"
  "90 3 -" ]
|> List.map (fun expr -> (expr, evalRpnExpr expr))
|> List.iter (fun (expr, result) -> printfn "(%s) = %A" expr result)

