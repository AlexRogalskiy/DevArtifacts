[<Measure>] type f
[<Measure>] type c

let fahrenheitToCelsius (t : float<f>) =
  ((float t - 32.0) * (5.0/9.0)) * 1.0<c>

let celsiusToFahrenheit (t : float<c>) =
  ((float t * (9.0/5.0)) + 32.0) * 1.0<f>

type f with static member toCelsius = fahrenheitToCelsius
            static member fromCelsius = celsiusToFahrenheit

type c with static member toFahrenheit = celsiusToFahrenheit
            static member fromFahrenheit = fahrenheitToCelsius;;

c.toFahrenheit 100.0<c>;;
f.toCelsius 212.0<f>;;
