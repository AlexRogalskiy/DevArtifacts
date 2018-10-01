class CreateSubscriptions < ActiveRecord::Migration
  def change
    create_table :subscriptions do |t|
      t.references :leader, index: true
      t.references :follower, index: true

      t.timestamps
    end
  end
end
