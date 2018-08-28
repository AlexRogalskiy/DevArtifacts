class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
	    t.integer :purchaser_id
	    t.integer :ticket_type_id
	    t.integer :quantity
	    t.decimal :cost, precision: 9, scale: 2
	    t.decimal :ticket_fee, precision: 9, scale: 2
	    t.datetime :purchased_at

      t.timestamps
    end
  end
end
