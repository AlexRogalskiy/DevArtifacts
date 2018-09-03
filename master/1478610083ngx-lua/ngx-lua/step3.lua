ngx.req.read_body()

ngx.say("step 3")

local key = '12345' 
local body = ngx.req.get_body_data()
	if body then 
end

local h = ngx.req.get_headers()
local token = h.Authorization

md_hash = token:match("([^Token ].+)")

local data = body .. key

if (ngx.md5(data) ~= md_hash) then 
	ngx.say("Access denied")
	return
end 

ngx.say("Ok")
