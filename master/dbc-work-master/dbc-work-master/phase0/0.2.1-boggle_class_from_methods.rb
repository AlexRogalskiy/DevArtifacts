class BoggleBoard

  def initialize(dice_grid)
    @dice_grid = dice_grid
  end


  def create_word(*coords)
    coords.map { |coord| @dice_grid[coord.first][coord.last]}.join('')
  end


  def get_row(row)
    @dice_grid[row]
  end


  def get_col(col)
    @dice_grid.map {|row|  row[col]}
  end


  def get_diagonal(start_row, end_row)
    unless ((start_row == 0) && (end_row == 3)) | ((start_row == 3) && (end_row == 0))
      raise ArgumentError.new('Diagonal must start at row 0 and end at 3, or start at row 3 and end at 0')
    end

    coords = [0, 1, 2, 3]
    start_row == 0 ? coords.replace(coords.zip(coords)) : coords.replace(coords.reverse.zip(coords))
    return coords.map {|row, col| @dice_grid[row][col]}
  end
end


dice_grid = [['b', 'r', 'a', 'e'],
             ['i', 'o', 'd', 't'],
             ['e', 'c', 'l', 'r'],
             ['t', 'a', 'k', 'e']]

boggle_board = BoggleBoard.new(dice_grid)

# implement tests for each of the methods here:
puts boggle_board.create_word([1,2], [1,1], [2,1], [3,2]) #=> dock

puts boggle_board.get_row(0).join('') #=> brae
puts boggle_board.get_row(1).join('') #=> iodt
puts boggle_board.get_row(2).join('') #=> eclr
puts boggle_board.get_row(3).join('') #=> take

puts boggle_board.get_col(0).join('') #=> biet
puts boggle_board.get_col(1).join('') #=> roca
puts boggle_board.get_col(2).join('') #=> adlk
puts boggle_board.get_col(3).join('') #=> etre

puts boggle_board.get_diagonal(0, 3).join('') #=> bole
puts boggle_board.get_diagonal(3, 0).join('') #=> tcde

# create driver test code to retrieve a value at a coordinate here:
p boggle_board.get_row(0)[1] == 'r' #=> true
p boggle_board.get_row(1)[1] == 'o' #=> true
p boggle_board.get_row(2)[3] == 'r' #=> true
p boggle_board.get_row(0)[3] == 'e' #=> true
p boggle_board.get_row(3)[2] != 'r' #=>true


# review & reflect

# I think this is a good example of object-oriented design. But I've been trying to figure out why
# it specifically is targeting the transition from procedural to OOP...at first I thought it was
# referencing our progression over the  weeks, but I think that while limited, we have implemented
# object-oriented design prior to this challenge. We have  been expected to program modularly--
# create classes and define its methods; construct objects as instances of those  classes; calling
# methods on those objects, both inherited from the Object class and those we defined for that class
# . But then I realized it was probably referring to the nested array methods challenge to the
# cohesive,  modular BoggleBoard class, and it made a little more sense. Anyway, OOP might require
# "more code" at the start,  but it enables and promotes code reuse with larger programs and
# significantly reduces the amount of code  required- particularly when we begin moving toward
# inherited objects. If we wanted to play a second game of boggle, it would be significantly easier
# to simply define a new dice_grid. I think OOP allows us to protect the inter  workings and object
# definitions and define the interface to which objects interact with other objects.
