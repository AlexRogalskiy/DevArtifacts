class State < ActiveRecord::Base
	before_save {self.name = name.capitalize}

	# Database Relationships
	has_many :events
	has_many :cities

	#Validations
	validates :name, uniqueness: :true
end
