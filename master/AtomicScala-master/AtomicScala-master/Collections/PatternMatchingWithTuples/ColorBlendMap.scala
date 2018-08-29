import paintcolors.Color
import paintcolors.Color._

var blender = (for {
  a <- Color.values
  b <- Color.values
  c = colorblend.blend(a, b)
} yield ((a, b), c)).toMap

blender.foreach(println)