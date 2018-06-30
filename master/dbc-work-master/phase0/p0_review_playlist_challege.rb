# Your awesome code goes here!
class Song
  attr_reader :track, :artist
  def initialize(track, artist)
    @track = track
    @artist = artist
  end

  def play
    puts 'NOW PLAYING' + ' ' + self.track + '-' + self.artist
  end

end

class Playlist
  attr_reader :list

  def initialize(*songs)
    @list = songs
  end

  def add(*songs)
    songs.each {|song| @list << song}
  end

  def num_of_tracks
    @list.length
  end

  def remove(song)
    @list.delete(song)
  end

  def includes?(song)
    true if @list.include?(song)
  end

  def play_all
    @list.each {|song| song.play}
  end

  def display
    puts 'CURRENT PLAYLIST'
    @list.each {|song| puts song.track + '-' + song.artist}
  end
end



#### Driver Code#### The code below should *drive* your coding...

one_by_one = Song.new("One by One", "Sirenia")
world_so_cold = Song.new("World So Cold", "Three Days Grace")
going_under = Song.new("Going Under", "Evanescence")

my_playlist = Playlist.new(one_by_one, world_so_cold, going_under)

lying_from_you = Song.new("Lying From You", "Linkin Park")
angels = Song.new("Angels", "Within Temptation")

my_playlist.add(lying_from_you, angels)
p my_playlist.num_of_tracks == 5
going_under.play
my_playlist.remove(angels)
p my_playlist.includes?(lying_from_you) == true
my_playlist.play_all
my_playlist.display




### Put your Reflection here:

# I started a version with a Music Library class and began modeling the relationship between the library, songs, and
# playlists. I want to finish it but it got quite involved and I think it's best if i move on to the other challenges
# and then come back and work on my extended playlist if/when there is time
