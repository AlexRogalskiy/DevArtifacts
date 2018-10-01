# The Book of Ruby - http://www.sapphiresteel.com

s = "Hello world"
puts( s[1] ) 		# Ruby 1.8: prints out 101 the ASCII value of 'e'
					# Ruby 1.9: prints out 'e'

achar=s[1]
puts( achar )
puts( s[1,1] )
puts( achar.ord )	# Ruby 1.9 - prints ASCII value: 101 
					# Ruby 1.8 - error, undefined method