#view a group

require "rubygems"
require "rest_client"
require "json"

# Need to specify group_id in url
# eg:
# site = RestClient::Resource.new("http://domain.freshdesk.com/groups/5.json","sample@freshdesk.com","test")

site = RestClient::Resource.new("http://domain.freshdesk/groups/[group_id].json","sample@freshdesk.com","test")

response = site.get(:accept=>"application/json")

puts "response: #{response.code} \n #{response.body} \n"