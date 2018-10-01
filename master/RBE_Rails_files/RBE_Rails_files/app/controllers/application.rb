# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  # Pick a unique cookie name to distinguish our session data from others'
  session :session_key => '_photo_album_session_id'

=begin explain
Now all_photos() can be used in any other controller.
=end
  def all_photos()
    Photo.find(:all)
  end

end
