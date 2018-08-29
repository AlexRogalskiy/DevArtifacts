
def banded(input: Double) =
  if (input > 1.0 || input < 0.0)
    None
  else
    Some(math.round(input * 100.0))

for(x<-banded(0.1)) println(x)

println(
  banded(0.555), banded(-0.1), banded(1.1)
)

val result = for {
  d<-Vector(-0.1,0.1,0.3,0.9,1.2)
  n<-banded(d)
} yield n

println(result)
