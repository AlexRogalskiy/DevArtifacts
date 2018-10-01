let createCounter() =
  let count = ref 0
  (fun () -> count := !count + 1
             !count)

let increment = createCounter()
for i in 1..10 do printfn "%i" (increment())
