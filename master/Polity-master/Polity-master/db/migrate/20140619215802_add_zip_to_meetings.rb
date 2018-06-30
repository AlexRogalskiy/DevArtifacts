class AddZipToMeetings < ActiveRecord::Migration
  def change
    add_column :community_meetings, :zip, :string
  end
end
