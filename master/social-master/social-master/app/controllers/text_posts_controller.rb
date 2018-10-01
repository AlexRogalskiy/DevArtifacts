class TextPostsController < ApplicationController
  def new
    @text_post = TextPost.new
  end

  def create
    @text_post =
      current_user.text_posts.build(text_post_params)

    if @text_post.save
      redirect_to post_path(@text_post),
                    notice: "Post created!"
    else
      render :new, alert: "Error creating post."
    end
  end

  def edit
    @text_post = current_user.text_posts.find(params[:id])
  end

  def update
    @text_post = current_user.text_posts.find(params[:id])

    if @text_post.update(text_post_params)
      redirect_to post_path(@text_post), notice: "Post updated!"
    else
      render :edit, alert: "Error updating post."
    end
  end

  private

  def text_post_params
    params.require(:text_post).permit(:title, :body)
  end
end
