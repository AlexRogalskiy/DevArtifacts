open System.Threading

let lazyOperation =
  lazy (printfn "evaluating lazy expression"
        Thread.Sleep(1000)
        42)

lazyOperation.Force() |> printfn "Result: %i"
