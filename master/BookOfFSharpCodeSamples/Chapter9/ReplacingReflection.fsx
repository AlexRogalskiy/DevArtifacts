// Adapted from: http://fssnip.net/eu

module Validation =
  open System
  open Microsoft.FSharp.Quotations
  open Microsoft.FSharp.Quotations.Patterns

  type Test<'e> = | Test of ('e -> (string * string) option)

  let private add (quote : Expr<'x>) message args validate (xs : Test<'e> list) =
    let propName, eval =
      match quote with
      | PropertyGet (_, p, _) -> p.Name, fun x -> p.GetValue(x, [||])
      | Value (_, ty) when ty = typeof<'e> -> "x", box
      | _ -> failwith "Unsupported expression"
    let test entity =
      let value = eval entity
      if validate (unbox value) then None
      else Some (propName, String.Format(message, Array.ofList (value :: args)))
    Test(test) :: xs

  let notNull quote =
    let validator = (fun v -> v <> null)
    add quote "Is a required field" [] validator

  let notEmpty quote =
    add quote "Cannot be empty" [] (String.IsNullOrWhiteSpace >> not)

  let between quote min max =
    let validator = (fun v -> v >= min && v <= max)
    add quote "Must be at least {2} and greater than {1}" [min; max] validator

// Uncomment for another type of validation
//  let email quote =
//    let regex = Text.RegularExpressions.Regex(@"\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*")
//    add quote [] "Invalid email address" regex.IsMatch

  let createValidator (f : 'e -> Test<'e> list -> Test<'e> list) =
    let entries = f Unchecked.defaultof<_> []
    fun entity -> List.choose (fun (Test test) -> test entity) entries;;

open Validation;;
  
type TestType = { ObjectValue : obj
                  StringValue : string
                  IntValue : int };;

let validate =
  createValidator <| fun x -> notNull <@ x.ObjectValue @> >>
                              notEmpty <@ x.StringValue @> >>
                              between <@ x.IntValue @> 1 100;;

{ ObjectValue = obj(); StringValue = "Sample"; IntValue = 35 }
|> validate;;

{ ObjectValue = null; StringValue = ""; IntValue = 1000 }
|> validate;;
