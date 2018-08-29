import util.Try

def intPercent(amount: Int, total: Int) = Try(amount * 100 / total).getOrElse(100)

println(intPercent(49, 100), intPercent(49, 1000), intPercent(49, 0))