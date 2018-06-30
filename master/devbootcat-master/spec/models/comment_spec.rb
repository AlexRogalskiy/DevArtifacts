require 'spec_helper'

describe Comment, :type => :model do
  context "migrations" do
    it { should have_db_column(:text) }
    it { should have_db_column(:author_id) }
    it { should have_db_column(:post_id) }
  end

  context "validations" do
    it { should belong_to(:author).class_name('User') }
    it { should validate_presence_of(:text) }
    it { should validate_presence_of(:post_id) }
  end

  context "liking" do
    it "can be liked" do
      comment = Comment.create(text: "hey I'm a comment", post_id: 1)
      expect { comment.likes.create }.not_to raise_error
    end
  end
end
