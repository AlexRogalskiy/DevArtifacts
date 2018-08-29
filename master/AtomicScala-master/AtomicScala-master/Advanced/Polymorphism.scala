trait Power

trait Cleverness

class Pupa extends Power

class Chef extends Power with Cleverness

def doTheThing(value: Power with Cleverness) = value.getClass

println(doTheThing(new Chef))

println(doTheThing(new Power with Cleverness))