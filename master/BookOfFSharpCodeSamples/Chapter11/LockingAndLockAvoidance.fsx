open System
open System.Threading.Tasks;;

Parallel.For(0, 100, fun n -> lock Console.Out (fun () -> printfn "%i" n));;

Parallel.For(0, 100, (sprintf "%i") >> Console.WriteLine);;
