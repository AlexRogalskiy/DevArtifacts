open System;;

let flattenedAggregateExceptionExample() =
  try
    raise (AggregateException(
            NotSupportedException(),
            ArgumentException(),
            AggregateException(
              ArgumentNullException(),
              NotImplementedException())))               
  with
  | :? AggregateException as ex ->
       ex.Flatten().Handle(
        Func<_, _>(
          function
          | :? NotImplementedException as ex2 -> printfn "%O" ex2; true
          | _ -> true));;

flattenedAggregateExceptionExample();;
