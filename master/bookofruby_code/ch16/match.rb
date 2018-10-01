# The Book of Ruby - http://www.sapphiresteel.com

puts( /cde/ =~ 'abcdefg' )
puts( /cde/.match('abcdefg') )
p( /cde/.match('abcdefg') )

p( /xde/ =~ 'abcdefg' )
p( /xde/.match('abcdefg') )
