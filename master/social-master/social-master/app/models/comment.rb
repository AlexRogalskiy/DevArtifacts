class Comment < ActiveRecord::Base
  belongs_to :post, touch: true
  belongs_to :user

  validates :user_id, presence: true
end
