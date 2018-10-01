type Toggle() =
  let toggleChangedEvent = Event<_>()
  let mutable isOn = false
  [<CLIEvent>]
  member x.ToggleChanged = toggleChangedEvent.Publish
  member x.Toggle() =
    isOn <- not isOn
    toggleChangedEvent.Trigger (x, isOn)

let myToggle = Toggle()
let onHandler, offHandler =
  myToggle.ToggleChanged
  |> Event.map (fun (_, isOn) -> isOn)
  |> Event.partition (fun isOn -> isOn)

onHandler |> Event.add (fun _ -> printfn "Turned on!")
offHandler |> Event.add (fun _ -> printfn "Turned off!")

myToggle.Toggle()
myToggle.Toggle()
