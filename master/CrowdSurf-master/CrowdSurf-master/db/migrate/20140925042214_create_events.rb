class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
	    t.string :title
	    t.string :location_name
	    t.string :street
	    t.string :city_id
	    t.string :state_id
	    t.string :zip
	    t.float :longitude
	    t.float :latitude
	    t.string :youtube_id
	    t.integer :category_id
	    t.string :flyer_uid
	    t.string :flyer_name
	    t.text :details
	    t.datetime :start
	    t.datetime :end
	    t.integer :user_id

      t.timestamps
    end
		add_index :events, [:user_id, :created_at]
  end
end
