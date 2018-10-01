# Example taken from Ruby 1.9 documentation

a = Thread.new { raise("die now") }
b = Thread.new { Thread.stop }
c = Thread.new { Thread.exit }
d = Thread.new { sleep }

p   d.kill                  #=> #<Thread:0x401b3678 aborting>
p   a.status                #=> nil
p   b.status                #=> "sleep"
p   c.status                #=> false
p   d.status                #=> "aborting"
p   Thread.current.status   #=> "run"

