class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  protect_from_forgery with: :exception unless ['development','test'].include? Rails.env

  #TODOS: do we need this or can i delete it?
  # def after_sign_in_path_for(user)
  #   sign_in_url = url_for(:action => "new", :controller => "sessions", :only_path => false, :protocol => "http")
  #   if request.referer == sign_in_url
  #     super
  #   else
  #     stored_location_for(user) || request.referer || root_path
  #   end

  # end

  def after_sign_in_path_for(resource)
    user_path(resource)
  end

  def after_sign_out_path_for(resource)
    user_path(resource)
  end

end
