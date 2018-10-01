module Api
  class TextPostsController < ApplicationController
    respond_to :json

    before_action :authenticate_token!

    def create
      @text_post = @api_user.text_posts.create(text_post_params)
      respond_with @text_post
    end

    private

    def text_post_params
      params.require(:text_post).permit(:title, :body)
    end
  end
end
