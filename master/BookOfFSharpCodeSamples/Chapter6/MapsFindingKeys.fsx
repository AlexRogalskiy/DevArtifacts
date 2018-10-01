let stateCapitals =
  Map [("Indiana", "Indianapolis")
       ("Michigan", "Lansing")
       ("Ohio", "Columbus")
       ("Kentucky", "Frankfort")
       ("Illinois", "Springfield")];;

stateCapitals |> Map.tryFindKey (fun k v -> v = "Indianapolis");;
stateCapitals |> Map.tryFindKey (fun k v -> v = "Olympia");;
