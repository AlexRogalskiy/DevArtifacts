class FeedController < ApplicationController

  CONTENT_TYPE = 'application/rss+xml'

=begin explain
all_photos() found in app/controllers/application.rb
=end

  def images()
    @photos = all_photos() 
    @headers['Content-Type'] = CONTENT_TYPE
  end

end
