class HomeController < ApplicationController
before_filter :authenticate_user!, :only => [:index, :new] # Devise
# By adding the code above, your Rails application will run the controller filter, which is executed before executing all the actions defined in the controller. You can also modify the filter so that it will be executed only for all actions using :only or :except code.
  include HomeHelper
  def index
    @posts = Post.all
  end


end
