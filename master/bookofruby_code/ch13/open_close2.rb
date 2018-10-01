# The Book of Ruby - http://www.sapphiresteel.com


def isNewRuby
	newR = false # is this > Ruby version 1.8?
	majorNum = RUBY_VERSION[0,1]
	minorNum = RUBY_VERSION[2,1]
	if ( majorNum == "2" ) || (minorNum  == "9" ) then
		newR = true
	else 
		newR == false
	end
	return newR		
end

f = File.new("myfile.txt", "w")
f.puts( "I", "wandered", "lonely", "as", "a", "cloud" )
f.close

charcount = 0
linecount = 0

f = File.new("myfile.txt", "r")
while !( f.eof ) do
	c = f.getc()	
# version 1 - test floating point number
#	if (RUBY_VERSION.to_f > 1.8) then 
#		c = c.ord
#	end
# version 2 - test major and minor numbers using isNewRuby method
	if (isNewRuby) then
		c = c.ord
	end
	if ( c == 10 ) then 		
		linecount += 1
		puts( " <End Of Line #{linecount}>" )
	else
		putc( c )
		charcount += 1
	end
end

if f.eof then 
	puts( "<End Of File>" ) 
end

f.close

puts("This file contains #{linecount} lines and #{charcount} characters." )

if (RUBY_VERSION.to_f > 1.8) then 
	puts "ok"
end