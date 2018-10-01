# The Book of Ruby - http://www.sapphiresteel.com

arr = ['a', 'b', 'c']

puts(arr[0])  # shows ‘a’
puts(arr[1])  # shows ‘b’
puts(arr[2])  # shows ‘c’
puts(arr[3])  # nil

# Ruby 1.9 prints nil as an empty string "".
# Use one of the following techniques to test for nil
puts( "---display nil---" )
puts(arr[3].inspect) 
puts(arr[3].class) 
p(arr[3]) 
puts(arr[3].nil?) 