type Euler1Builder() =
  member x.For(g, f) = Seq.map f g
  member x.Yield(v) = if (v % 3 = 0 || v % 5 = 0) then v else 0
  member x.Run(s) = Seq.reduce (+) s

let euler1 = Euler1Builder()

euler1 { for x = 1 to 999 do yield x } // 233168
