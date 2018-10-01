let rand = System.Random();;

Seq.init 10 (fun _ -> rand.Next(100));;
