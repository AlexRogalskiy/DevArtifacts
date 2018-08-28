class Like < ActiveRecord::Base
	# Database Relationships
	belongs_to :liker, class_name: 'User'
	belongs_to :liked, class_name: 'Event'

	# Validations
	validates :liker_id, presence: true
	validates :liked_id, presence: true
end
