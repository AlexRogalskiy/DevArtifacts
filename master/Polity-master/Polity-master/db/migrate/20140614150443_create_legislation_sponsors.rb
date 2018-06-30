class CreateLegislationSponsors < ActiveRecord::Migration
  def change
    create_table :legislation_sponsors do |t|
      t.integer :sponsor_id
      t.integer :legislation_id

      t.timestamps
    end
    add_index :legislation_sponsors, :sponsor_id
    add_index :legislation_sponsors, :legislation_id
  end
end
