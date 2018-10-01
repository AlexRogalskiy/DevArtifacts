let isEven number =
  if number = 0 then
    sprintf "zero"
  elif number % 2 = 0 then
    sprintf "%i is even" number
  else
    sprintf "%i is odd" number

isEven 0
isEven 1
isEven 2