class CreateCommunityMeetings < ActiveRecord::Migration
  def change
    create_table :community_meetings do |t|
      t.belongs_to :creator, index: true
      t.string :address
      t.datetime :time_at
      t.string :topic
      t.belongs_to :ward, index: true

      t.timestamps
    end
  end
end
 