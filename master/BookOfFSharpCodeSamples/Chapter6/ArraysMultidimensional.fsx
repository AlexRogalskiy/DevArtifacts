let movies = 
  array2D [| [| "The Terminator"; "1984" |]
             [| "Predator"; "1987" |]
             [| "Commando"; "1985" |]
             [| "The Running Man"; "1987" |]
             [| "True Lies"; "1994" |]
             [| "Last Action Hero"; "1993" |]
             [| "Total Recall"; "1990" |]
             [| "Conan the Barbarian"; "1982" |]
             [| "Conan the Destroyer"; "1984" |]
             [| "Hercules in New York"; "1969" |] |];;

// Vertical slices
movies.[0..,0..0];;
movies.[0..,1..1];;

// Horizontal slices
movies.[1..3,0..];;
