class UserAddress < ActiveRecord::Base
  belongs_to :ward
  has_many :users
  accepts_nested_attributes_for :users
end
