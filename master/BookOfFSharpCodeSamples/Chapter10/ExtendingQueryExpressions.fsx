#load "__querySource.fsx";;

open System
open Microsoft.FSharp.Linq;;

type QueryBuilder with
  [<CustomOperation("exactlyOneWhen")>]
  member __.ExactlyOneWhen (source : QuerySource<'T,'Q>,
                            [<ProjectionParameter>] selector) =
    System.Linq.Enumerable.Single (source.Source, Func<_,_>(selector))

  [<CustomOperation("exactlyOneOrDefaultWhen")>]
  member __.ExactlyOneOrDefaultWhen (source : QuerySource<'T,'Q>,
                                     [<ProjectionParameter>] selector) =
    System.Linq.Enumerable.SingleOrDefault (source.Source, Func<_,_>(selector))

  [<CustomOperation("averageByNotNull")>]
  member inline __.AverageByNotNull< 'T, 'Q, 'Value
                      when 'Value :> ValueType
                      and 'Value : struct
                      and 'Value : (new : unit -> 'Value)
                      and 'Value : (static member op_Explicit : 'Value -> float)>
    (source : QuerySource<'T, 'Q>,
     [<ProjectionParameter>] selector : 'T -> Nullable<'Value>) =
      source.Source
      |> Seq.fold
          (fun (s, c) v -> let i = v |> selector
                           if i.HasValue then
                            (s + float i.Value, c + 1)
                           else (s, c))
          (0.0, 0)
      |> (function
          | (_, 0) -> Nullable<float>()
          | (sum, count) -> Nullable(sum / float count));;

query { for f in QuerySource.films do
        averageByNotNull f.gross };;

query { for f in QuerySource.films do
        exactlyOneWhen (f.id = 4) };;
