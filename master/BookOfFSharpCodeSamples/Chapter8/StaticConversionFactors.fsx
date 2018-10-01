[<Measure>] type ft
[<Measure>] type inch = static member perFoot = 12.0<inch/ft>;;

2.0<ft> * inch.perFoot;;
36.0<inch> / inch.perFoot;;
