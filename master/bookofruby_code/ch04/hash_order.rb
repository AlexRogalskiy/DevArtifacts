# The Book of Ruby - http://www.sapphiresteel.com

# Ruby 1.9 orders hashes by keys, earlier versions of Ruby do not

h = {2=>"two", 1=>"one", 4=>"four" }
p( h )
h[3] = "three"
p( h )
h2 = {"one"=>1, 2=>"two", 4.5=>"four" }
p (h2)