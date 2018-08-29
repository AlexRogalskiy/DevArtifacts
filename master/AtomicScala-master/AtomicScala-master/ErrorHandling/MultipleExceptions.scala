import errors._

def test(which:Int) =
try {
  toss(which)
}  catch {
  case Except1(why) => s"Except1 $why"
  case Except2(n) => s"Except2 $n"
  case Except3(msg,d) => s"Except3 $msg $d"
}

println(test(0),test(1),test(2),test(3))