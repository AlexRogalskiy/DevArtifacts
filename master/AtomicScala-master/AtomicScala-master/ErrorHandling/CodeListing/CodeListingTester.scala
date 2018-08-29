package codelistingtester

class CodeListingTester(makeList:String => IndexedSeq[String]){
  println(makeList("CodeListingTester.scala")(4))
  println(makeList("NotAFile.scala")(0))
  println(makeList("NotAScalaFile.txt")(0))
  println(makeList(null)(0))
}