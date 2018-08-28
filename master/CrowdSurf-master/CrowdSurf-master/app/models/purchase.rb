class Purchase < ActiveRecord::Base

	# Database Relationships
	belongs_to :purchaser, class_name: 'User'
	belongs_to :ticket_type
	has_many :tickets

	# Validations
	validates_presence_of :purchaser, :purchased_at, :ticket_type, :ticket_type_id, :quantity


end
