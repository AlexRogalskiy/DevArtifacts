# The Book of Ruby - http://www.sapphiresteel.com

f = Fiber.new do
	puts( "In fiber" )
    Fiber.yield( "yielding" )
	puts( "Still in fiber" )
	Fiber.yield( "yielding again" )
	puts( "But still in fiber" )
end

puts( "a" )
puts( f.resume )
puts( "b" )
puts ( f.resume )
puts( "c" )
puts( f.resume )
puts( "d" )
puts( f.resume ) # dead fiber called
