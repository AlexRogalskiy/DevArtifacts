# The Book of Ruby - http://www.sapphiresteel.com
class X
	def outer_x
		print( "x:" )
		def nested_y
			print("ha! ")
		end	
		
		def nested_z
			print( "z:" )
			nested_y
		end
		
		nested_y
		nested_z
	end
end


ob = X.new
# NOTE: When testing uncomment only 1 ob method call at a time
# ob.nested_y and ob.nested_z cause errors. Now uncomment all 3. After 
# the call to ob.outer_x, you'll see that ob.nested_y and ob.nested_z don't cause errors!

# ob.outer_x
# ob.nested_y
# ob.nested_z

