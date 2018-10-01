let matchString =
  function
  | null
  | "" -> None
  | v -> Some(v.ToString())
