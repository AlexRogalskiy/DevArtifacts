class AddTotalPriceToTicketTypes < ActiveRecord::Migration
  def change
		add_column :ticket_types, :total_price, :decimal, precision: 9, scale: 2
  end
end
