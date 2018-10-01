open Microsoft.FSharp.Quotations
open Microsoft.FSharp.Quotations.Patterns;;

let operators =
  System.Type.GetType("Microsoft.FSharp.Core.Operators, FSharp.Core");;

let multiplyOperator = operators.GetMethod("op_Multiply");;

let varX, varY =
  multiplyOperator.GetParameters()
  |> Array.map (fun p -> Var(p.Name, p.ParameterType))
  |> (function | [| x; y |] -> x, y
               | _ -> failwith "not supported");;

let call = Expr.Call(multiplyOperator, [ Expr.Var(varX); Expr.Var(varY) ])
let innerLambda = Expr.Lambda(varY, call)
let outerLambda = Expr.Lambda(varX, innerLambda)

(* <@@ fun x y -> x * y @@> *)
