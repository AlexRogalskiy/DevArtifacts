import util.Try

def f(n:Int) = Try(toss(n)).recover {
  case e:Throwable => e.getMessage
}.get

def g(n:Int) = Try(toss(n)).recover {
  case Except1(why) => why
  case Except2(n) => n
  case Except3(msg, d) => s"$msg $d"
}.get

f(0)
f(1)
f(2)
f(3)