class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @posts = @user.posts.order("created_at DESC")
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to root_url,
        notice: "Welcome to the site!"
    else
      render "new"
    end
  end

  def follow
    @user = User.find(params[:id])

    if current_user.follow!(@user)
      redirect_to @user, notice: "Follow successful!"
    else
      redirect_to @user, alert: "Error following."
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password,
                                 :password_confirmation)
  end
end
