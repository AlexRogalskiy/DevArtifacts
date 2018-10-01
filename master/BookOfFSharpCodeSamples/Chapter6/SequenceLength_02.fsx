seq { for i in 1..10 do
      printfn "Evaluating %i" i
      yield i }
|> Seq.length = 0

// More efficient check using isEmpty
seq { for i in 1..10 do
      printfn "Evaluating %i" i
      yield i }
|> Seq.isEmpty
