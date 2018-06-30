require 'spec_helper'

describe Like, :type => :model do
  # pending "add some examples to (or delete) #{__FILE__}"
  context "migration" do
    it { should have_db_column(:user_id)}
    it { should have_db_column(:likable_id)}
    it { should have_db_column(:likable_type)}
  end

  context "validations" do
    it { should validate_presence_of(:likable)}
    it { should belong_to(:likable) }
  end
end
