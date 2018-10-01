# The Book of Ruby - http://www.sapphiresteel.com

$i = 0

def addNum(aNum)
	aNum + 1
end

somethreads = (1..3).collect {
	Thread.new {
		1000000.times{ $i = addNum($i)  }
	}
}


somethreads.each{|t| t.join } 
puts( $i )