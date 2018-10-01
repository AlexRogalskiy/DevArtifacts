# The Book of Ruby - http://www.sapphiresteel.com

require 'thread'


$i = 0
semaphore = Mutex.new

def addNum(aNum)
	aNum + 1
end

somethreads = (1..3).collect {
	Thread.new {
		semaphore.synchronize{
			1000000.times{ $i = addNum($i)  }
		}
	}
}


somethreads.each{|t| t.join } 
puts( $i )