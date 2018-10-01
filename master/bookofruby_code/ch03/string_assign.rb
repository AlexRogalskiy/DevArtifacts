# The Book of Ruby - http://www.sapphiresteel.com

s = "hello world"
print( "1) s='#{s}' and s.object_id=#{s.object_id}\n" )
s = s + "!"			# a new string is created so the two s variables here refer to different objects
print( "2) s='#{s}' and s.object_id=#{s.object_id}\n" )
s = s.capitalize	# this creates a new string object
print( "3) s='#{s}' and s.object_id=#{s.object_id}\n" )
s.capitalize!		# but this modifies the original string object
print( "4) s='#{s}' and s.object_id=#{s.object_id}\n" )
s[1] = 'A'			# this also modifies the original string object
print( "5) s='#{s}' and s.object_id=#{s.object_id}\n" )
print( "The first char of s, s[0,1], is '#{s[0,1].to_s}' and the last char [s-1,1] is #{s[-1,1].to_s}" )

