# The Book of Ruby - http://www.sapphiresteel.com

def showDay( i )
	case( i )
		when 1 then puts("It's Monday" )
		when 2 then puts("It's Tuesday" )
		when 3 then puts("It's Wednesday" )
		when 4 then puts("It's Thursday" )
		when 5 then puts("It's Friday" )
		when (6..7) then puts( "Yippee! It's the weekend! " )
		else puts( "That's not a real day!" )
	end
end



for i in 1..8 do
	showDay( i )
end