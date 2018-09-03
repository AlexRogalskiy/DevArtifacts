		ngx.req.read_body()  -- explicitly read the req body
		local body = ngx.req.get_body_data()
		
		if body then

			local key = "12345"	 	
			local h = ngx.req.get_headers()
			local token = h.Authorization

			md_hash = token:match("([^Token ].+)")
				
			local data = body .. key

			--ngx.say("body:", ngx.md5(data))

			if ngx.md5(data) ~= md_hash then
				ngx.exit(ngx.HTTP_FORBIDDEN)
			end
			return
		end

		--	ngx.say("no body")
		ngx.exit(ngx.HTTP_FORBIDDEN)

