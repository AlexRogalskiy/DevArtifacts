class CreateWards < ActiveRecord::Migration
  def change
    create_table :wards do |t|
      t.integer :ward_number
      t.string :address1
      t.string :address2
      t.string :zip

      t.timestamps
    end
  end
end
