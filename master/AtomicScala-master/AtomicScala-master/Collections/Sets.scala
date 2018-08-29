val set = Set(1,1,2,3,9,9,4,22,11,7,6)
//no dups
println(set)

println(set(9))
println(set(99))

println(Set(1,6,9,2).subsetOf(set))
//union
val union1 = set.union(Set(2,3,4,99))
val union2 = set | Set(2,3,4,99)

println(union1)
println(union2)

//intersection

val intersect1 = set & Set(0,1,11,22,87)
val intersect2 = set intersect  Set(0,1,11,22,87)

println(intersect1)
println(intersect2)

//difference

val dif = set &~ Set(0,1,11,22,87)
val dif2 = set -- Set(0,1,11,22,87)

println(dif)
println(dif2)

val ch = for(i<-0 to 2) yield 'a' to 'd'

println(ch)
println(ch.flatten)
println(ch.flatten.toSet)


