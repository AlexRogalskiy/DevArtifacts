let classicNames = [ "Susan"; "Barbara"; "Sarah Jane" ]
let modernNames = [ "Rose"; "Martha"; "Donna"; "Amy"; "Clara" ];;

classicNames @ modernNames;;
List.append classicNames modernNames;;

List.concat [[ "Susan"; "Sarah Jane" ]
             [ "Rose"; "Martha" ]
             ["Donna"; "Amy"; "Clara"]];;
