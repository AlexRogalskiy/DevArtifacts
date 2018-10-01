require 'test_helper'

class PostTest < ActiveSupport::TestCase
  def setup
    @post1 = posts(:post1)
    @post2 = posts(:post2)
  end

  test "validates user_id presence" do
    @post1.user_id = nil

    assert_not @post1.valid?
  end

  test "TextPost requires body" do
    assert_instance_of TextPost, @post1

    @post1.body = nil

    assert_not @post1.valid?
  end

  test "ImagePost requires url" do
    assert_instance_of ImagePost, @post2

    @post2.url = nil

    assert_not @post2.valid?
  end
end
