[<LiteralAttribute>]
let Zero = 0
[<LiteralAttribute>]
let One = 1
[<LiteralAttribute>]
let Two = 2
[<LiteralAttribute>]
let Three = 3

let numberToString =
  function
  | Zero -> "zero"
  | One -> "one"
  | Two -> "two"
  | Three -> "three"
  | _ -> "unknown"