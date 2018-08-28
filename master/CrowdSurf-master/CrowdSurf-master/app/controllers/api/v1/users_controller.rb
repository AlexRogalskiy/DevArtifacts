class Api::V1::UsersController < UsersController

  respond_to :json

  def index
    respond_with @users = User.all
  end

  def show
    respond_with @user = User.find(params[:id])
  end

end