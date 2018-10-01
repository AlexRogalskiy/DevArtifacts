# The Book of Ruby - http://www.sapphiresteel.com

# Ruby 1.9 (or above) only
p( :abcdefgh.match( /cdefg/ ) )		# literal chars
p( :abcdefgh.match( /cd..g/ ) )		# dot matches any char

									# list of chars in square brackets
p( :cat.match( /[fc]at/ ) )
p( :cat.match( /[xy]at/ ) )

									# match char in a range
p( :ABC100x3Z.match( /[A-Z][0-9][A-Z0-9]/ ) )
p( :ABC100x3Z.match( /[a-z][0-9][A-Z0-9]/ ) )