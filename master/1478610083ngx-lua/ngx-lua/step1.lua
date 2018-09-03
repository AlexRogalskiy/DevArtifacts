ngx.say("step 1")

ngx.req.read_body()

local key = '12345' 
local body = ngx.req.get_body_data()
	if body then 
	ngx.say( ngx.md5(body .. key ))
end
