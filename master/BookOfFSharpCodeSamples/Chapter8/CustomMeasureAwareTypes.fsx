[<Measure>] type ft
[<Measure>] type inch = static member perFoot = 12.0<inch/ft>;;

type Point< [<Measure>] 'u > = { X : float<'u>; Y : float<'u> } with
  member this.FindDistance other =
    let deltaX = other.X - this.X
    let deltaY = other.Y - this.Y
    sqrt ((deltaX * deltaX) + (deltaY * deltaY));;

let p = { X = 10.0<inch>; Y = 10.0<inch> }
p.FindDistance { X = 20.0<inch>; Y = 15.0<inch> };;
