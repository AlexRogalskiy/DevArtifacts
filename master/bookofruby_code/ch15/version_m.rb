# The Book of Ruby - http://www.sapphiresteel.com

x = Marshal.dump( "hello world" )
print( "Marshal version: #{x[0].ord}:#{x[1].ord}\n" )	# Ruby 1.9 
print( "Marshal version: #{x[0]}:#{x[1]}\n" )			# Ruby 1.8

puts( Marshal::MAJOR_VERSION )
puts( Marshal::MINOR_VERSION )


p( x[0] )
p( x[1] )