class Like < ActiveRecord::Base
  belongs_to :likable, :polymorphic => true
  validates :likable, :presence => true
end
