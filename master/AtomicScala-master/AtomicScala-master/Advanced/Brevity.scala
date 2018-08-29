//Scala Brevity Principles according to the book

//1. Eliminate intermediate results
//2.Omit unnecessary curly braces
//3.Omit semicolons
//4.Remove unnecessary arguments
"OttoBoughtAnAuto".foreach(c => print(c))
println('\n')
"OttoBoughtAnAuto".foreach(print(_))
println('\n')
"OttoBoughtAnAuto".foreach(print)
println('\n')
//5.Use type inference to return types
//6.Aliasing names with type
case class VeryLongClassName()
type Short = VeryLongClassName
val sh = new Short

//exrcs
def assignResult(arg:Boolean)= if (arg) 42 else 47

println(assignResult(true))
println(assignResult(false))
