let numberToString =
  function
  | 0 -> "zero"
  | 1 -> "one"
  | 2 -> "two"
  | 3 -> "three"
  | n -> sprintf "%O" n;;

numberToString 4;;
