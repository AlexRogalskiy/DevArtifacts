class Ticket < ActiveRecord::Base

	# Database Relationships
	belongs_to :ticket_type
	belongs_to :purchase

	# Validations
	validates_presence_of :purchase

end
