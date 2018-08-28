require 'test_helper'

class PrelaunchControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

end
