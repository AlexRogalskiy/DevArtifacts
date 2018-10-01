#r "System.Data.Services.Client"
#r "FSharp.Data.TypeProviders";;

open Microsoft.FSharp.Data.TypeProviders;;

type northwind =
  ODataService<"http://services.odata.org/V3/Northwind/Northwind.svc/">
let svc = northwind.GetDataContext();;

let invoices =
  query { for i in svc.Invoices do
          sortByNullableDescending i.ShippedDate
          select (i.OrderDate, i.CustomerName, i.ProductName)
          take 5 };;

svc.DataContext.SendingRequest.Add (fun args -> printfn "%O" args.Request.RequestUri);;
invoices |> Seq.iter (printfn "%A");;
