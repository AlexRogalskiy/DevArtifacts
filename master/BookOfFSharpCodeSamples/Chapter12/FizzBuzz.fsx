type FizzBuzzSequenceBuilder() =
  member x.Yield(v) =
    match (v % 3, v % 5) with
    | 0, 0 -> "FizzBuzz"
    | 0, _ -> "Fizz"
    | _, 0 -> "Buzz"
    | _ -> v.ToString()
  member x.Delay(f) = f() |> Seq.singleton
  member x.Delay(f : unit -> string seq) = f()
  member x.Combine(l, r) =
    Seq.append (Seq.singleton l) (Seq.singleton r)
  member x.Combine(l, r) =
    Seq.append (Seq.singleton l) r
//  member x.Combine(l : string seq, r : string seq) =
//    Seq.append l r
  member x.For(g, f) = Seq.map f g

let fizzbuzz = FizzBuzzSequenceBuilder();;

fizzbuzz { yield 1 };;

fizzbuzz {
  yield 1
  yield 2
  yield 3 };;

(*
fizzbuzz.Delay (fun () ->
  fizzbuzz.Combine (
    fizzbuzz.Yield 1,
    fizzbuzz.Delay (fun () ->
      fizzbuzz.Combine(
        fizzbuzz.Yield 2,
        fizzbuzz.Delay (fun () -> fizzbuzz.Yield 3)))))
*)

fizzbuzz { for x = 1 to 99 do yield x };;
fizzbuzz { for x in 1..99 do yield x };;
fizzbuzz { yield 1
           yield 2
           for x = 3 to 50 do yield x };;

//fizzbuzz { yield 1
//           yield 2
//           for x = 3 to 97 do yield x
//           yield 98
//           yield 99
//           } |> Seq.iter (printfn "%s")
