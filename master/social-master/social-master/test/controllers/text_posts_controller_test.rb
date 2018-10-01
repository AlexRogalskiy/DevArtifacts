require 'test_helper'

class TextPostsControllerTest < ActionController::TestCase
  test "get new with new post" do
    user1 = users(:user1)

    get :new, {}, { user_id: user1.id }

    text_post = assigns(:text_post)

    assert text_post.new_record?
    assert_response :success
  end

  test "should create post" do
    user = users(:user1)
    params = {
      text_post: {
        title: "Test Title",
        body: "Test Body"
      }
    }

    post :create, params, { user_id: user.id }

    text_post = assigns(:text_post)

    assert text_post.persisted?
    assert_redirected_to post_url(text_post)
  end
end
