class CreateUserAddresses < ActiveRecord::Migration
  def change
    create_table :user_addresses do |t|
      t.integer :ward_id
      t.string :address1
      t.string :address2
      t.string :zip

      t.timestamps
    end
    add_index :user_addresses, :ward_id
  end
end
