class City < ActiveRecord::Base
	before_save {self.name = name.capitalize}

	# Database Relationships
	has_many   :events
	belongs_to :state
end
