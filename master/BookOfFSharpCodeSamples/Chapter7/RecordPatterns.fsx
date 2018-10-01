type Name = { First : string; Middle : string option; Last : string };;

let formatName =
  function
  | { First = f; Middle = Some(m); Last = l } -> sprintf "%s, %s %s" l f m
  | { First = f; Middle = None; Last = l } -> sprintf "%s, %s" l f

let hasMiddleName =
  function
  | { Middle = Some(_) } -> true
  | { Middle = None } -> false
