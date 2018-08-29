object Quoting{
  implicit class AnyName(s:String){
    def singleQuote = s"'$s'"
    def doubleQuote = s""""$s""""
  }
}

import Quoting._
//Because the class is implicit,
// Scala takes any String called with either singleQuote or doubleQuote and converts it to an AnyName,
// thus legitimizing the call.
println("Hi".singleQuote)

println("Hi".doubleQuote)