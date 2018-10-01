#r "System.Data.Services.Client"
#r "FSharp.Data.TypeProviders"

open Microsoft.FSharp.Data.TypeProviders

(*
  To use this example you must register for an account on the Azure Datamarket then
  subscribe to the 2006 - 2008 Crime in the United States dataset from data.gov. Once
  you've subscribed you'll need to plug-in your user name and password keys below.
*)

let userName, password = "", ""
let credentials = System.Net.NetworkCredential(userName, password)

type crimeData = ODataService<"https://api.datamarket.azure.com/data.gov/Crimes/v1/">
let context = crimeData.GetDataContext(Credentials = credentials)

let getCrimeData state city =
  query {
    for crime in context.CityCrime do
    where (crime.State.Equals(state) && crime.City.Equals(city))
    sortBy crime.Year
    select crime
  }
  |> Seq.toList

[ ("Michigan", "Detroit")
  ("Michigan", "Flint")
  ("Michigan", "Lansing")
  ("Indiana", "Indianapolis")
  ("Indiana", "Fort Wayne") ]
|> List.map (fun (state, city) -> getCrimeData state city)
|> List.fold (fun state data -> state @ data) []
|> Seq.iter (fun c -> printfn "City: %s (%i)\tMurders: %i" c.City c.Year c.MurderAndNonEgligentManslaughter)
