class AddFieldsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :img_url, :text, default: "https://www.myzydeco.com/assets/blank_user_icon.png"
    add_column :users, :twitter_handle, :string
  end
end
