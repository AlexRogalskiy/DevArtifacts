# The Book of Ruby - http://www.sapphiresteel.com


def getBinding()
	str = "bye"
	return binding()
end
str = "hello"
puts( eval( "str + ' Fred'" )   )                  #=> "hello Fred"
puts( eval( "str + ' Fred'", getBinding() ) )      #=> "bye Fred"
puts( eval( "str + ' Fred'" )   )                  #=> "hello Fred"