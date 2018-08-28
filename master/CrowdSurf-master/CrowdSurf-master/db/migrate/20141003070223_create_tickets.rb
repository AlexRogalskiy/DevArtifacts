class CreateTickets < ActiveRecord::Migration
  def change
    create_table :tickets do |t|
      t.integer :ticket_type_id
      t.integer :purchase_id

      t.timestamps
    end
  end
end
