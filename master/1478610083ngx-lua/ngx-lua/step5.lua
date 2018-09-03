local method = ngx.req.get_method()
local key = "12345"     
local h = ngx.req.get_headers()
local token = h.Authorization

ngx.say("step 5")

if token == nil then
	ngx.exit(ngx.HTTP_FORBIDDEN)
end

md_hash = token:match("([^Token ].+)")

if  method == "POST" or method == "PUT" then 
	ngx.req.read_body()  -- explicitly read the req body
	local body = ngx.req.get_body_data()
	if body then
			
		local data = body .. key

		ngx.say("body:", ngx.md5(data))
		
		if ngx.md5(data) ~= md_hash then
			ngx.exit(ngx.HTTP_FORBIDDEN)
		end

		ngx.say("Ok")
		
		return
	end

--	ngx.say("no body, POST")
	ngx.exit(ngx.HTTP_FORBIDDEN)
	return
end

if  method == "GET" or method == "DELETE" then 
	local str = ngx.var.uri .. '?' .. ngx.var.args .. key
	ngx.say("method GET:\t", ngx.md5( str) )

	if md_hash == ngx.md5(str) then
		ngx.say("Authorization:\tOk")
		return
	end	
	ngx.say("Authorization:\tFalse")
	return
end

ngx.say("send by method:", ngx.req.get_method())
	
	ngx.exit(ngx.HTTP_FORBIDDEN)
