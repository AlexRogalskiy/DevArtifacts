open System
open System.Threading.Tasks;;

Parallel.For(0, 1000, printfn "%i");;
Parallel.ForEach([| 1..1000 |], printfn "%A");;
