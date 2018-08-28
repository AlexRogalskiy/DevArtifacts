class Category < ActiveRecord::Base
	before_save {self.name = name.capitalize}

	#Database Relationships
	has_many :events
end
