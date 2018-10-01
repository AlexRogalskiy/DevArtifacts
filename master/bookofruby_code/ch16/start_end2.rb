# The Book of Ruby - http://www.sapphiresteel.com

p( /^[a-z 0-9]*$/ =~ 'well hello 123' )	# match at 0
p( /^[a-z 0-9]*$/ =~ 'Well hello 123' )	# no match due to ^ and uppercase 'W' 
p( /[a-z 0-9]*$/ =~ 'Well hello 123' )	# no ^, so match made at char 1 'e'

p( /[a-z 0-9]$/ =~ 'Well hello 123' )	# $ match from end = 13
p( /^[a-z 0-9]*/ =~ 'Well hello 123' )	# * zero (or more) matches at start ^ = 0
p( /^[a-z 0-9]+/ =~ 'Well hello 123' )	# + 1 or (or more) matches at start ^ = nil

p( /[a-z 0-9]*$/ =~ 'Well hello 123' )	# zero or more matches - first match at 1 ('e')

# match empty string?
p( /^[a-z 0-9]*$/ =~ '' ) # yes (*) - match at 0
p( /^[a-z 0-9]+$/ =~ '' ) # no  (+) - nil