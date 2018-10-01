# The Book of Ruby - http://www.sapphiresteel.com

# Display chars with codes 0 to 126
i = 0
begin
	s = "[" << i << ":" << i.to_s << "]"
	puts(s) 
	i += 1
end until i == 126