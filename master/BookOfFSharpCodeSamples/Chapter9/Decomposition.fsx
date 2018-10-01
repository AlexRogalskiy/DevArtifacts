open System.Text
open Microsoft.FSharp.Quotations.Patterns
open Microsoft.FSharp.Quotations.DerivedPatterns
open Microsoft.FSharp.Quotations.ExprShape

let rec showSyntax =
  function
  | Int32 v ->
      sprintf "%i" v
  | Value (v, _) ->
      sprintf "%s" (v.ToString())
  | SpecificCall <@@ (+) @@> (_, _, exprs) ->
      let left = showSyntax exprs.Head
      let right = showSyntax exprs.Tail.Head
      sprintf "%s + %s" left right
  | SpecificCall <@@ (-) @@> (_, _, exprs) ->
      let left = showSyntax exprs.Head
      let right = showSyntax exprs.Tail.Head
      sprintf "%s - %s" left right
  | Call (opt, mi, exprs) ->
      let owner = match opt with
                  | Some expr -> showSyntax expr
                  | None -> sprintf "%s" mi.DeclaringType.Name
      if exprs.IsEmpty then
        sprintf "%s.%s ()" owner mi.Name
      else
        let sb = StringBuilder(showSyntax exprs.Head)
        exprs.Tail
        |> List.iter (fun expr ->
                        sb
                          .Append(",")
                          .Append(showSyntax expr) |> ignore)
        sprintf "%s.%s (%s)" owner mi.Name (sb.ToString())
//  Uncomment for more complex expressions
//  | Application (left, right) ->
//      sprintf "%s %s" (showSyntax left) (showSyntax right)
//  | Let (v, bodyExpr, sourceExpr) ->
//      let body = showSyntax bodyExpr
//      let source = showSyntax sourceExpr
//      if v.IsMutable then
//        sprintf "let mutable %s = %s in %s" v.Name body source
//      else
//        sprintf "let %s = %s in %s" v.Name body source
  | ShapeVar var ->
      sprintf "%A" var
  | ShapeLambda (p, body) ->
      sprintf "fun %s -> %s" p.Name (showSyntax body)
  | ShapeCombination (o, exprs) ->
      let sb = StringBuilder()
      exprs |> List.iter (fun expr -> sb.Append(showSyntax expr) |> ignore)
      sb.ToString()

showSyntax <@ fun x y -> x + y @>;;
showSyntax <@ fun x y -> x - y @>;;
showSyntax <@ 10 * 20 @>;;
showSyntax <@@ System.Math.Max(10, 20) @@>;;
