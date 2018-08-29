val v = Vector(1,3,5,7,1,2)

for (i<-v.sorted){
  println(i)
}

for (i<-v.tail){
  println(i)
}

for (i<-v.reverse){
  println(i)


}


for (i<-Range(0,11)){
  println(i)
}


for (i<-0 to 10){
  println(i)
}


for (i<-0 until 10){
  println(i)
}


for (i<-'a' to 'z'){
  println(i)
}



println(v(2))

val chef = if (1==2) {"pupa"} else {"chef"}

println(chef)