let (|Fizz|Buzz|FizzBuzz|Other|) n =
  match (n % 3, n % 5) with
  | 0, 0 -> FizzBuzz
  | 0, _ -> Fizz
  | _, 0 -> Buzz
  | _ -> Other n;;

let fizzBuzz =
  function
  | Fizz -> "Fizz"
  | Buzz -> "Buzz"
  | FizzBuzz -> "FizzBuzz"
  | Other n -> n.ToString();;

seq { 1..100 }
|> Seq.map fizzBuzz
|> Seq.iter (printfn "%s");;
