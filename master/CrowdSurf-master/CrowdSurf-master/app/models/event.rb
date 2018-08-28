class Event < ActiveRecord::Base
	dragonfly_accessor :flyer

	# Database Relationships
	belongs_to :user
	belongs_to :state
	belongs_to :city
	belongs_to :category
	has_many :ticket_types
	has_many :tickets, through: :ticket_types

	has_many :reverse_likes, foreign_key: "liked_id", class_name: "Like", dependent: :destroy
	has_many :likers, through: :reverse_likes, source: :liker

	has_many :reverse_attends, foreign_key: "attended_id", class_name: "Attend", dependent: :destroy
	has_many :attendees, through: :reverse_attends, source: :attendee

	accepts_nested_attributes_for :ticket_types, allow_destroy: true


	# Validations
	validates_presence_of :title, :location_name, :details, :category_id, :state, :city_id
	validates :title, length: {maximum: 50}
	validates :street, length: {maximum: 500}, allow_nil: true
	validates :zip, length: {is: 5}
	validates :youtube_id, length: {maximum: 100}, allow_nil: true

	geocoded_by :address
	after_validation :geocode, if: ->(obj){ obj.address.present? and obj.address_changed? }

	# Methods
	def address
		if street.present?
			"#{street} #{city.name}, #{state.name} #{zip}"
		else
			"#{city.name}, #{state.name} #{zip}"
		end
	end

	def address_changed?
		attrs = %w(street city_id state_id zip)
		attrs.any?{|a| send "#{a}_changed?"}
	end
end