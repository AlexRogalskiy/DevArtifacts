let movies = [| ("The Terminator", "1984")
                ("Predator", "1987")
                ("Commando", "1985")
                ("Total Recall", "1990")
                ("Conan the Destroyer", "1984") |];;

movies |> Array.sortInPlaceBy (fun (_, y) -> y)
movies;;

movies |> Array.sortInPlaceWith (fun (_, y1) (_, y2) -> if y1 < y2 then -1
                                                        elif y1 > y2 then 1
                                                        else 0)
movies;;