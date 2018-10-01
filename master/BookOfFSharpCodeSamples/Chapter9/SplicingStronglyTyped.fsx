let numbers = seq { 1..10 }
let sum = <@ Seq.sum numbers @>
let count = <@ Seq.length numbers @>
let avgExpr = <@ %sum / %count @>
