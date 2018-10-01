open Microsoft.FSharp.Quotations

type Calc =
  [<ReflectedDefinition>]
  static member Multiply x y = x * y;;

let expr =
  typeof<Calc>
    .GetMethod("Multiply")
  |> Expr.TryGetReflectedDefinition;;

(*
  [<ReflectedDefinition>]
  type Calc =
    static member Add x y = x + y
    static member Subtract x y = x - y
    static member Multiply x y = x * y
    static member Divide x y = x / y

  let rec private writeCalls =
    function
    | Patterns.Call (e, mi, lst) -> printfn "!%A %A %A" e mi lst
    | ExprShape.ShapeLambda (_, e) -> writeCalls e
    | _ -> ()

  let exprs =
    typeof<Calc>.GetMethods()
    |> Array.map (fun i -> i.Name, Expr.TryGetReflectedDefinition i)
    |> Array.filter (function | _, Some(_) as i -> true | _ -> false)
*)