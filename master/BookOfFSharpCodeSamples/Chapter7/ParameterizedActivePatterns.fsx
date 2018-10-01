let (|DivisibleBy|_|) d n = if n % d = 0 then Some DivisibleBy else None;;

let fizzBuzz =
  function
  | DivisibleBy 3 & DivisibleBy 5 -> "FizzBuzz"
  | DivisibleBy 3 -> "Fizz"
  | DivisibleBy 5 -> "Buzz"
  | n -> n.ToString();;

seq { 1..100 }
|> Seq.map fizzBuzz
|> Seq.iter (printfn "%s");;
