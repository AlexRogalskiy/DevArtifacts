open System
open System.Data
let dt = new DataTable("person")
dt.Columns.AddRange
  [| new DataColumn("person_id", typedefof<int>)
     new DataColumn("first_name", typedefof<string>)
     new DataColumn("last_name", typedefof<string>) |]
dt.Constraints.Add("pk_person", dt.Columns.[0], true)

let h1, h2 =
  dt.RowChanged
  |> Event.partition
      (fun ea ->
        let ln = ea.Row.["last_name"] :?> string
        ln.Equals("Pond", StringComparison.InvariantCultureIgnoreCase))

h1.Add (fun _ -> printfn "Come along, Pond")
h2.Add (fun _ -> printfn "Row changed")

dt.Rows.Add(1, "Rory", "Williams") |> ignore
dt.Rows.Add(2, "Amelia", "Pond") |> ignore
