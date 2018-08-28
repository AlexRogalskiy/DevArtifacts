class AddUsernameAndAdminToUsers < ActiveRecord::Migration
  def change
	  add_column :users, :username, :string
	  add_column :users, :admin, :boolean, null: false, default: false
	  add_index :users, :username, unique: true
  end
end
