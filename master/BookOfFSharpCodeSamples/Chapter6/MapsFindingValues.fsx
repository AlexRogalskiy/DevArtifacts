let stateCapitals =
  Map [("Indiana", "Indianapolis")
       ("Michigan", "Lansing")
       ("Ohio", "Columbus")
       ("Kentucky", "Frankfort")
       ("Illinois", "Springfield")];;

stateCapitals.["Indiana"];;
stateCapitals |> Map.find "Indiana";;
stateCapitals |> Map.containsKey "Washington";;
stateCapitals |> Map.tryFind "Washington";;
stateCapitals |> Map.tryFind "Indiana";;
