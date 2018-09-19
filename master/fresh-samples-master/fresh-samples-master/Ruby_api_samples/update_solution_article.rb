#Update solution article

require "rubygems"
require "rest_client"
require "json"

# Need to specify category_id,folder_id,article_id in url
# eg:
# site = RestClient::Resource.new("http://domain.freshdesk.com/solution/categories/6/folders/4/articles/1.json?tags=test","sample@freshdesk.com","test")

site = RestClient::Resource.new("http://domain.freshdesk.com/solution/categories/[category_id]/folders/[folder_id]/articles/[article_id].json?tags=test","sample@freshdesk.com","test")

#Status: 1-Draft,2-Published	
#art_type: 1-Permanent,2-Workaround

response = site.put({:solution_article=>{:title=>"updated article",:status => 1,:art_type => 1, :description => "Testing",:folder_id=>4}},:content_type=>"application/json")

puts "response: #{response.code} \n #{response.body} \n"