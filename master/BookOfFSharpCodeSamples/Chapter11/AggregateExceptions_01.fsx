open System;;

let aggregateExceptionExample() =
  try
    raise (AggregateException(
            NotSupportedException(),
            ArgumentException(),
            AggregateException(
              ArgumentNullException(),
              NotImplementedException())))               
  with
  | :? AggregateException as ex ->
       ex.Handle(
        Func<_, _>(
          function
          | :? AggregateException as ex1 ->
              ex1.Handle( 
                Func<_, _>(
                  function
                  | :? NotImplementedException as ex2 -> printfn "%O" ex2; true
                  | _ -> true
                ))
              true
          | _ -> true)
      );;

aggregateExceptionExample();;
