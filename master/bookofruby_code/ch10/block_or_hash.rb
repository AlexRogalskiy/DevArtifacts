# The Book of Ruby - http://www.sapphiresteel.com

# puts({|i| puts(i)}.class) #<= block has no class. This is an error!
puts({1=>2}.class) #<= Hash
puts({}.class) #<= Hash
puts( "But what is this...?" )
puts{}.class #<= ???
print{}.class #<= nil in Ruby 1.8; ??? in 1.9
puts( "Now let's try with parentheses..." )
print({}.class) #<= Hash