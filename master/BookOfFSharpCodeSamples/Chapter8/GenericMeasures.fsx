[<Measure>] type ft
[<Measure>] type inch = static member perFoot = 12.0<inch/ft>

let square (v : float<_>) = v * v;;

square 10.0<inch>;;
square 10.0<ft>;;
square 10.0;;
