# The Book of Ruby - http://www.sapphiresteel.com

class X
	def nothidden( aStr, anotherStr )
		anotherStr = aStr << " " << anotherStr	
		return anotherStr.reverse
	end
end

ob = X.new
str1 = "dlrow"
str2 = "olleh"
str3 = ob.nothidden(str1, str2)
puts( str1 )
puts( str2 )
puts( str3 )

