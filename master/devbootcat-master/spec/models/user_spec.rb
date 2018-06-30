require 'spec_helper'

describe User, :type => :model do
  context "validations" do
    it { should validate_presence_of(:email)}
    it { should validate_uniqueness_of(:email) }
  end

  context "migrations" do
    it { should have_db_column(:email) }
  end

  context "associations" do
    it { should have_many(:posts)}
  end
end

