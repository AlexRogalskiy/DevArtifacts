# The Book of Ruby - http://www.sapphiresteel.com

require 'find'
require 'thread'

$totalsize = 0
$dirsize = 0

semaphore = Mutex.new

def processFiles( baseDir )
	Find.find( baseDir ) { |path|			
		$dirsize += $dirsize	# if a directory
		if (FileTest.directory?(path)) && (path != baseDir ) then				   		
			print( "\n#{path} [#{$dirsize / 1024}K]" )
			$dirsize = 0		
		else					# if a file
			$filesize = File.size(path)
			print( "\n#{path} [#{$filesize} bytes]" )				
			$dirsize += $filesize		
			$totalsize += $filesize
		end		
	}	
end

t1 = Thread.new{
	semaphore.synchronize{
		processFiles( '..' ) # <======= edit this directory name
	}
}

t2 = Thread.new{	
	semaphore.synchronize{
		while t1.alive? do 
			print( "\n\t\tProcessing..." )
		end
	}
}

t2.join

printf( "\nTotal: #{$totalsize} bytes, #{$totalsize/1024}K, %0.02fMB\n\n",  "#{$totalsize/1048576.0}" )
puts( "Total file size: #{$filesize}, Total directory size: #{$dirsize}" )