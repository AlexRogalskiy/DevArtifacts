class Addoauthtousers < ActiveRecord::Migration
  def change
    add_column :users, :oauth_token_twitter, :string
    add_column :users, :oauth_secret_twitter, :string
  end
end
