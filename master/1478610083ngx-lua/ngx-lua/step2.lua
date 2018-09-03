ngx.say("step 2")

ngx.req.read_body()

local key = '12345' 
local body = ngx.req.get_body_data()
	if body then 
	ngx.say( ngx.md5(body .. key ))
end

local h = ngx.req.get_headers()
local token = h.Authorization

md_hash = token:match("([^Token ].+)")

ngx.say(md_hash)