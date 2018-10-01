# The Book of Ruby - http://www.sapphiresteel.com

count = 0
File.foreach( 'regex1.rb' ){ |line|	
	count += line.scan( /[a-z0-9A-Z]+/ ).size
}


puts( "There are #{count} words in this file." )

