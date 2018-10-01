let slope p1 p2 =
  let x1 = fst p1
  let y1 = snd p1
  let x2 = fst p2
  let y2 = snd p2
  (y1 - y2) / (x1 - x2)

slope (13.0, 8.0) (1.0, 2.0)
