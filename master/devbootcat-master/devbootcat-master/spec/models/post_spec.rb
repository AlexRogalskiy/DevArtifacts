# Tests to include: 
#   - Creating a new post -> "should create post"
#   - Finding a post
#   - Updating a post -> "should update post"
#   - Destroying a post -> "should destroy post"
#   - Testing that you can successfully find a post -> "should find post"
#      http://my.safaribooksonline.com/book/programming/ruby/9781430260349/chapter-11-testing-your-application/sec2_9781430260349_ch11_xhtml
#   - Test validations -> "should not create a post without title nor body"

require 'spec_helper'

describe Post, :type => :model do
  context "migration" do
     it { should have_db_column(:author_id) }
     it { should have_db_column(:title) }
     it { should have_db_column(:body) }

  end

  context "validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:body) }
    it { should belong_to(:author).class_name('User') }
  end

  context "liking" do
    it "can be liked" do
      post = Post.create(title: "woo", body: "meh")
      expect { post.likes.create }.not_to raise_error
    end
  end
end
