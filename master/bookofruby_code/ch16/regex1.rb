# The Book of Ruby - http://www.sapphiresteel.com

# This file shows three ways of creating a
# regular expression.

regex1 = Regexp.new('^[a-z]*$')
regex2 = /^[a-z]*$/
regex3 = %r{^[a-z]*$}

p( regex1 )
p( regex2 )
p( regex3 )

# Note that =~ is test for equality
# It means, return True if a regular
# expression matches a string

def test( aStr, aRegEx ) 
	if aRegEx =~ aStr then
		puts( "All lower case" )
	else
		puts( "Not all lower case" )
	end
end

test( "hello", regex1 )
test( "hello", regex2 )
test( "Hello", regex3 )


