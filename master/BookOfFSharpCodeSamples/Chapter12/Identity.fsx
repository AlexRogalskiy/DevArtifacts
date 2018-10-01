// Identity monad - doesn't actually do anything

type Identity<'T> = | Identity of 'T

type Identity_() =
  member x.Bind(value, rest : _ -> Identity<_>) =
    printfn "Binding: %O" value
    rest value
//  member x.Return(value) =
//    printfn "Returning: %O" value
//    Identity value

