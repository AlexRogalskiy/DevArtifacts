let slope p1 p2 =
  let x1, y1 = p1
  let x2, y2 = p2
  (y1 - y2) / (x1 - x2)

slope (13.0, 8.0) (1.0, 2.0)
