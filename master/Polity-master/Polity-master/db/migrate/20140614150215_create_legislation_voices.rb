class CreateLegislationVoices < ActiveRecord::Migration
  def change
    create_table :legislation_voices do |t|
      t.integer :user_id
      t.integer :legislation_id
      t.boolean :support
      t.text :feedback

      t.timestamps
    end
    add_index :legislation_voices, :legislation_id
    add_index :legislation_voices, :user_id
  end
end
