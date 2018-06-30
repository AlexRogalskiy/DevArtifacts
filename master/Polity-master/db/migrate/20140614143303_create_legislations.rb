class CreateLegislations < ActiveRecord::Migration
  def change
    create_table :legislations do |t|
      t.string :city_identifier
      t.string :status
      t.string :kind
      t.date :opened_date
      t.date :closed_date

      t.timestamps
    end
    add_index :legislations, :city_identifier
  end
end
