require 'pry'

class BoggleBoard
  # attr_reader :board
  def initialize
    @board = Array.new(4) {["__"] * 4}
    @letters = ("A".."Z").to_a

    @dice = ['AAEEGN',
             'ELRTTY', 
             'AOOTTW', 
             'ABBJOO', 
             'EHRTVW', 
             'CIMOTU', 
             'DISTTY', 
             'EIOSST', 
             'DELRVY',
             'ACHOPS', 
             'HIMNQU', 
             'EEINSU', 
             'EEGHNW', 
             'AFFKPS', 
             'HLNNRZ', 
             'DEILRX']
  end


  def shake!
    @board.map! do |row|
      row.map! do |letter|
        letter = @dice.shuffle.pop.chars.sample
        letter == 'Q' ? 'Qu'.ljust(3) : letter.ljust(3)
      end
    end

  end


  def to_s
    puts "B  O  G  G  L  E".center(16) 
    puts "=="*8
    board_string = ""
    @board.each do |row|
      board_string += row.join("  ")
      board_string += "\n"
    end
    board_string
  end

end


board = BoggleBoard.new
# puts board

board.shake!
puts board
puts "--------SHAKE RATTLE & ROLL-------"