class CreateTicketTypes < ActiveRecord::Migration
  def change
    create_table :ticket_types do |t|
	    t.string :name
	    t.text :description
	    t.integer :event_id
	    t.decimal :cost, precision: 9, scale: 2
	    t.decimal :ticket_fee, precision: 9, scale: 2
	    t.integer :quantity

      t.timestamps
    end
  end
end
