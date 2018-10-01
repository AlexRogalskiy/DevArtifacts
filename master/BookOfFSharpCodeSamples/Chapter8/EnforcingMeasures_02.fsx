[<Measure>] type ft
[<Measure>] type sqft = ft ^ 2;;

let getArea (w : float<ft>) (h : float<ft>) : float<sqft> = w * h;;

getArea 10.0<ft> 10.0<ft>;;
