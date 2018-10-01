# The Book of Ruby - http://www.sapphiresteel.com

a = "hello world"

def foo
	yield 100
end

puts( a )
foo{ |b| puts( b ) }

# so what is a now...?
puts( a )

