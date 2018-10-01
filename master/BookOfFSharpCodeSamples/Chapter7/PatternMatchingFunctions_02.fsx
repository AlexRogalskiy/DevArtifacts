[ Some 10; None; Some 4; None; Some 0; Some 7 ]
|> List.filter (function | Some(_) -> true
                         | None -> false)
