class CreateLikes < ActiveRecord::Migration
  def change
    create_table :likes do |t|
	    t.integer :liker_id
	    t.integer :liked_id

	    t.timestamps
    end
    add_index :likes, :liker_id
    add_index :likes, :liked_id
    add_index :likes, [:liker_id, :liked_id], unique: true
  end
end
