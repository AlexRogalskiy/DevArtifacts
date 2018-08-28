class CreateAttends < ActiveRecord::Migration
  def change
    create_table :attends do |t|
	    t.integer :attendee_id
	    t.integer :attended_id
      t.timestamps
    end
    add_index :attends, :attendee_id
    add_index :attends, :attended_id
    add_index :attends, [:attendee_id, :attended_id], unique: true
  end
end
