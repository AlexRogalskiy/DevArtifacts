local args,err =  ngx.req.get_uri_args() 

if not args then
	 ngx.say("failed to get  args: ",err)
	 return
end
local str = ''
for key, val in pairs(args) do
    	 ngx.say(key, ": ", val)
end