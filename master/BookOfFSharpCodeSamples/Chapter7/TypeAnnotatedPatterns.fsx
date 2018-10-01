let startsWithUpperCase =
  function
  | (s : string) when s.Length > 0 && s.[0] = System.Char.ToUpper s.[0] ->
    true
  | _ -> false
