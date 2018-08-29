def matchColor(clr:String) = {
  clr match {
    case "RED" => println("star")
    case "BLUE" => println("sea")
    case _ => println("unknown symbol")
  }
}

matchColor("RED")
matchColor("BLACK")
