class Ballad
  attr_accessor :title
  attr_accessor :lyrics

  @@number_of_ballads = 0

  def initialize(title, lyrics='Tralala!')
    @title = title
    @lyrics = lyrics
    @@number_of_ballads += 1
  end

  def self.number_of_ballads
    @@number_of_ballads
  end
end

ballad = Ballad.new('The Ballad of Chucky Jim')

puts "Number of ballads: #{Ballad.number_of_ballads}"
puts "Ballad object ID: #{ballad.object_id}"
puts "Ballad title: #{ballad.title}"
puts "Ballad object ID again!: #{ballad.object_id}"
puts "Ballad lyrics: #{ballad.lyrics}"
