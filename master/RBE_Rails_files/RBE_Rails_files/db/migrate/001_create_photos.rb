class CreatePhotos < ActiveRecord::Migration
  
  COLUMN_NAMES = [:description, :image_path, :title, :photographer]

  SAMPLE_PHOTOS = [
    {
      :title        => 'Tonawanda Creek',
      :description  => 'A waterway in Tonawanda, NY.',
      :image_path   => '001_creek.jpg',
      :photographer => 'Vince',
    },
    {
      :title        => 'Travis',
      :description  => %q[My friend Travis. His wife Laura's head is partly in view as well.],
      :image_path   => '002_travis.jpg',
      :photographer => 'Vince',
    },
    {
      :title        => 'Liam & Ducks',
      :description  => 'My nephew Liam with some ducks.',
      :image_path   => '003_liam.jpg',
      :photographer => 'Vince',
    },
  ]

  def self.up
    
    create_table :photos do |t|
      COLUMN_NAMES.each { |c| t.column c, :text }
    end

    SAMPLE_PHOTOS.each do |sp|
      p = Photo.create(sp)
      p.save!
    end

  end

  def self.down
    drop_table :photos
  end
end
