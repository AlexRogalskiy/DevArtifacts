class UsersController < ApplicationController
  def show

  end

  def posts

    @user = User.find(params[:id])

    # @user_posts = Post.where("current_user = ALL(author_id)")
    @user_posts = @user.posts
  end

end
