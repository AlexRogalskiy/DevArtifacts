class Post < ActiveRecord::Base
  validates :title, presence: true
  validates :body, presence: true
  has_many :likes, as: :likable
  has_many :comments
  belongs_to :author, class_name: "User"
end
