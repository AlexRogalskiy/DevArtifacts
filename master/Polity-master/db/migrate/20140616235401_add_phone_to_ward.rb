class AddPhoneToWard < ActiveRecord::Migration
  def change
    add_column :wards, :phone_number, :string
  end
end
