let (|Fizz|_|) n = if n % 3 = 0 then Some Fizz else None
let (|Buzz|_|) n = if n % 5 = 0 then Some Buzz else None;;

let fizzBuzz =
  function
  | Fizz & Buzz -> "FizzBuzz"
  | Fizz -> "Fizz"
  | Buzz -> "Buzz"
  | n -> n.ToString();;

seq { 1..100 }
|> Seq.map fizzBuzz
|> Seq.iter (printfn "%s");;
