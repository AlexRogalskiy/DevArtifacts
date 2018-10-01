# The Book of Ruby - http://www.sapphiresteel.com


puts( "Main thread: #{Thread.main.inspect}" )	
puts( Thread.new{ }.inspect )					
puts( Thread.new{ sleep }.kill.inspect )		
puts( Thread.new{ sleep }.inspect )				
puts( Thread.new{ Thread.stop }.inspect )		
puts( Thread.new{ 
			for i in (1..100) do 
				i += 1 
			end }.inspect )
puts( "Main thread: #{Thread.main.inspect}" )


puts( "\n--- Compare Thread status and Thread inspect ---" )
thread1 = Thread.new{ }
puts( "thread1.status: #{thread1.status}, thread1.inspect #{thread1.inspect}" )

thread2 = Thread.new{ raise( "Exception raised!" ) }
puts( "thread2.status: #{thread2.status.inspect}, thread2.inspect #{thread2.inspect}" )

# NOTE: critical is only available in Ruby 1.8 or earlier
Thread.critical = true # prohibits scheduling of any existing thread (e.g by sleep)
thread3 = Thread.new{ sleep }.kill
puts( "thread3.status: #{thread3.status}, thread3.inspect #{thread3.inspect}" )
