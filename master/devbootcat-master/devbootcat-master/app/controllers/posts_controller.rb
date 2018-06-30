class PostsController < ApplicationController
  before_action :require_login, only: [:new, :create, :edit, :update]


  def index
    @posts = Post.all
  end

  def show
    @post = current_post
  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.new(post_params)
    if @post.save
      flash[:success] = "Post created!"
      redirect_to post_path(@post)
    else
      flash[:error] = "Something went wrong..."
      render :new
    end
  end

  def edit
    @post = current_post
    verify_authorship
  end

  def update
    # @post = current_post
    # verify_authorship
    if current_post.update_attributes(post_params)
      flash[:success] = "Post updated!"
      redirect_to post_path(current_post)
    else
      flash[:error] = "Something went wrong..."
      render 'edit'
    end
  end

  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    flash[:success] = "Post deleted!"
    redirect_to '/'

  end


  private

  def current_post
    @post = Post.find_by_id(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :body)
  end

  def require_login
    unless user_signed_in?
      redirect_to user_session_path
    end
  end

  def verify_authorship
    redirect_to '/' unless @post.author_id == current_user.id
  end

end
