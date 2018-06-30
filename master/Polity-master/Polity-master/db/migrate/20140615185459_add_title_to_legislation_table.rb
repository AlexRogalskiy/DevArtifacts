class AddTitleToLegislationTable < ActiveRecord::Migration
  def change
  	add_column :legislations, :title, :text
  end
end
