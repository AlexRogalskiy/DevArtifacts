class CreateLegislators < ActiveRecord::Migration
  def change
    create_table :legislators do |t|
      t.integer :alderman_id
      t.integer :represented_ward_id
      t.date :term_start_date
      t.date :term_end_date
      t.string :party_affiliation

      t.timestamps
    end
    add_index :legislators, :alderman_id
    add_index :legislators, :represented_ward_id
  end
end
