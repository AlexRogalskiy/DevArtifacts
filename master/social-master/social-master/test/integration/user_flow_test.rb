require 'test_helper'

class UserFlowTest < ActionDispatch::IntegrationTest
  test "user login, browse, and logout" do
    user = users(:user1)

    get "/login"

    assert_response :success

    post_via_redirect "/sessions",
      email: user.email,
      password: "password"

    assert_equal "/", path

    get_via_redirect "/logout"

    assert_equal "/login", path
  end
end
