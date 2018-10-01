# The Book of Ruby - http://www.sapphiresteel.com

def showDay( i )
	case( i )		
	when 5 then puts("It's Friday" )
		puts("...nearly the weekend!")
	when 6 then puts("It's Saturday!" )
		# the following never executes
	when 5 then puts( "It's Friday all over again!" )
	end	
end


showDay( 5 )
showDay( 6 )
