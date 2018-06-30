class Comment < ActiveRecord::Base
  belongs_to :author, class_name: "User"
  belongs_to :post
  has_many :likes, as: :likable
  validates :text, presence: true
  validates :post_id, presence: true
end
