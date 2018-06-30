class CreateLegislatorVotes < ActiveRecord::Migration
  def change
    create_table :legislator_votes do |t|
      t.integer :legislation_id
      t.integer :legislator_id
      t.date :vote_date
      t.string :vote

      t.timestamps
    end
    add_index :legislator_votes, :legislation_id
    add_index :legislator_votes, :legislator_id
  end
end
