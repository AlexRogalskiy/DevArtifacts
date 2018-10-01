# The Book of Ruby - http://www.sapphiresteel.com

require 'fiber'

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

if (f.alive?) then
	puts( f.resume ) 
else
	puts("Error: Call to dead fiber" )
end