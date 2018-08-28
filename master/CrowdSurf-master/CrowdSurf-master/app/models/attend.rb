class Attend < ActiveRecord::Base
# Database Relationships
	belongs_to :attendee, class_name: 'User'
	belongs_to :attended, class_name: 'Event'

	# Validations
	validates :attendee_id, presence: true
	validates :attended_id, presence: true
end
