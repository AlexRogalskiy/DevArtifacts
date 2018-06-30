class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.integer :user_address_id

      t.timestamps
    end
    add_index :users, :user_address_id
  end

end
