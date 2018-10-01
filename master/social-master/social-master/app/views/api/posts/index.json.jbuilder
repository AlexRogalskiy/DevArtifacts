json.array! @posts do |post|
  json.extract! post, :id, :title, :body, :url
  json.post_url api_post_url(post)

  json.user do
    json.extract! post.user, :id, :name, :email
  end
end
