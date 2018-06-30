class RegistrationsController < Devise::RegistrationsController
  protected

  # The path used after sign up. You need to overwrite this method
  # in your own RegistrationsController.
  def after_sign_up_path_for(resource)
    @user = current_user
    '/users/update_profile/'
  end

  def after_inactive_sign_up_path_for(resource)
    @user = current_user
    '/users/update_profile/'
  end

end
