open Microsoft.FSharp.Quotations
open Microsoft.FSharp.Quotations.Patterns
open System.ComponentModel

type PropertyChangedExample() as x =
  let pce = Event<_, _>()
  let mutable _myProperty = ""
  let triggerPce =
    function
    | PropertyGet(_, pi, _) ->
        let ea = PropertyChangedEventArgs(pi.Name)
        pce.Trigger(x, ea)
    | _ -> failwith "PropertyGet quotation is required"
  interface INotifyPropertyChanged with
    [<CLIEvent>]
    member x.PropertyChanged = pce.Publish
  member x.MyProperty with get() = _myProperty
                      and set(value) = _myProperty <- value
                                       triggerPce(<@@ x.MyProperty @@>);;

let pce = PropertyChangedExample()
(pce :> INotifyPropertyChanged).PropertyChanged.Add (fun ea -> printfn "Changing %s" ea.PropertyName);;
pce.MyProperty <- "123";;
