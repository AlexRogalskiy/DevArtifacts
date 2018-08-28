class TicketType < ActiveRecord::Base
	before_save {self.ticket_fee = total_fees}
	before_save {self.total_price = total_price_with_fees}
	before_destroy :no_purchases

	# Database Relationships
	belongs_to :event
	has_many :tickets
	has_many :purchases

	# Validations
	validates :name, presence: true

	def free?
		cost.blank? || cost.zero?
	end

	# Methods
	def no_purchases
		purchases.blank? ? true : false
	end

	def total_price_with_fees
		cost + total_fees
	end

	def total_fees
		fee = card_process_fee + crowdsurf_fee
		if fee > 9.95
			9.95
		else
			fee
		end
	end

	def card_process_fee
		cost * 0.029 + 0.30
	end

	def crowdsurf_fee
		cost * 0.02 + 0.69
	end
end
