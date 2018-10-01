class AlbumController < ApplicationController

=begin explain
This metaprogramming directive allows to define a 
specific helper called FooterHelper
in app/helpers/footer_helper.rb that can be shared 
among multiple controllers.
=end
  helper :footer

=begin explain
As with HTML files, this is the default implicit behavior.
all_photos is found in app/controllers/application.rb
=end
  def index()
    @photos = all_photos()
  end

=begin explain
Set up any instance variables to be used in the View 
or Helper, such as @photo here.
=end
  def show()
    @photo = Photo.find(params[:id])
  end

end
