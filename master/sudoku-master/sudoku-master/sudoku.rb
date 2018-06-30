module SudokuUtilities
  def validate_input(cell_input)
    [*1..9].include?(cell_input.to_i) ? cell_input.to_i : [*1..9]
  end

  def print_board
    i = 0
    a = 1
    loop_board do |cell|
      if i % 9 == 0
        print "\n  ------------------------------------------------------| \n  |  #{cell.content}  |"
      elsif a % 3 == 0
        print "  #{cell.content}  |"
      else
        print "  #{cell.content}  |"
      end
      i+=1
      a+=1
    end
    print "\n  ------------------------------------------------------"
  end

  def stringify
    output_string = ""
    loop_board do |cell|
      output_string += "#{cell.content}"
    end
    output_string
  end
end

class Sudoku
  include SudokuUtilities
  attr_accessor :full_board

  def initialize(board_string)
    board_string = board_string.chars
    @full_board = (0..2).map do |tri_square_index|
      (0..2).map do |square_index|
        (0..2).map do |tri_cell_index|
          (0..2).map do |cell_index|
            input = board_string[(tri_square_index * 27) + (square_index * 3) + (tri_cell_index * 9) + cell_index]
            Cell.new(input, tri_square_index, square_index, tri_cell_index, cell_index)
          end
        end
      end
    end
  end

  def solve!
    until finished?
      begin
        something_changed = false
        something_changed = standard_method || elimination_method
      end while something_changed

      return has_mistakes? ?  false :  guessing_method
    end
  end

  def has_mistakes?
    loop_board do |cell|
      return false unless cell.content.is_a?(Array) && cell.possibilities == []
    end
  end

  def finished?
    loop_board do |cell|
      return false if cell.content.is_a?(Array)
    end
  end

  def loop_square(tri_square, square)
    (0..2).each do |tri_cell|
      (0..2).each do |cell|
        yield @full_board[tri_square][square][tri_cell][cell]
      end
    end
  end

  def loop_row(tri_square, tri_cell)
    (0..2).each do |square|
      (0..2).each do |cell|
        yield @full_board[tri_square][square][tri_cell][cell]
      end
    end
  end

  def loop_column(square, cell)
    (0..2).each do |tri_square|
      (0..2).each do |tri_cell|
        yield @full_board[tri_square][square][tri_cell][cell]
      end
    end
  end

  def loop_board
    (0..2).each do |tri_square|
      (0..2).each do |tri_cell|
        loop_row(tri_square, tri_cell) { |cell| yield cell }
      end
    end
  end

  def standard_method
    begin
      something_changed = false
      loop_board do |cell|
        deletions = cell.possibilities.each_with_object([]) do |possibility, to_delete|

          check_for_deletions = lambda do |c|
            if c.content == possibility
              to_delete << possibility
              something_changed = true
            end
          end

          loop_row(cell.tri_square_index, cell.tri_cell_index) { |row_cell|  check_for_deletions.call(row_cell) }
          loop_column(cell.square_index, cell.cell_index) { |column_cell| check_for_deletions.call(column_cell) }
          loop_square(cell.tri_square_index, cell.square_index) { |square_cell| check_for_deletions.call(square_cell) }
        end

        cell.possibilities -= deletions
        cell.content = cell.possibilities.pop if cell.possibilities.length == 1
      end
    end while something_changed
    something_changed
  end

  def elimination_method
    something_changed = false
    loop_board do |cell|
      cell.possibilities.each do |possibility|
        elimination_method_valid = true

        validate_elimination_method = lambda do |c|
          unless c === cell
            if c.possibilities.include? possibility
              elimination_method_valid = false
            end
          end
        end

        detect_change = lambda do
          if elimination_method_valid
            cell.content = possibility
            cell.possibilities = [possibility]
            something_changed = true
          end
        end

        elimination_method_valid = true
        loop_row(cell.tri_square_index, cell.tri_cell_index) { |row_cell| validate_elimination_method.call(row_cell) }
        detect_change.call

        elimination_method_valid = true
        loop_column(cell.square_index, cell.cell_index) { |row_cell| validate_elimination_method.call(row_cell) }
        detect_change.call

        elimination_method_valid = true
        loop_square(cell.tri_square_index, cell.square_index) {|row_cell| validate_elimination_method.call(row_cell)}
        detect_change.call

      end
    end
    something_changed
  end

  #only make one guess and then continue the normal way (and guess on one where the possibilities are only 2)
  #find a way to save state before the guess.
  def guessing_method
    smallest_num_of_possibilities = 9

    loop_board do |cell|
      smallest_num_of_possibilities = cell.possibilities.length if cell.possibilities.length < smallest_num_of_possibilities && cell.content.is_a?(Array)
    end

    loop_board do |cell|
      if cell.possibilities.length == smallest_num_of_possibilities
        cell.possibilities.each do |guess_value|

          guessing_board_copy = Marshal.load(Marshal.dump(self))
          guessing_board_copy.full_board[cell.tri_square_index][cell.square_index][cell.tri_cell_index][cell.cell_index].content = guess_value
          guessing_board_copy.full_board[cell.tri_square_index][cell.square_index][cell.tri_cell_index][cell.cell_index].possibilities = []

          if guessing_board_copy.solve!
            self.full_board = guessing_board_copy.full_board
            return guessing_board_copy
          end
        end
        return false
      end
    end
  end

  def validate_solution
    return false if !finished?
    square_total, row_total, column_total = 0, 0, 0
      (0..2).each do |outside_index|
         (0..2).each do |inside_index|
              loop_square(outside_index, inside_index) {|cell| square_total += cell.content}
              loop_row(outside_index, inside_index) {|cell| row_total += cell.content}
              loop_column(outside_index, inside_index) {|cell| column_total += cell.content}
          end
       end
    false unless 405 == square_total && row_total && column_total
  end
end


class Cell
  attr_accessor :content, :possibilities
  attr_reader :tri_square_index, :tri_cell_index, :square_index, :cell_index
  include SudokuUtilities

  def initialize(input, tri_square_index, square_index, tri_cell_index, cell_index)
    @content = validate_input(input)
    @possibilities = [@content].flatten
    @tri_square_index = tri_square_index
    @tri_cell_index = tri_cell_index
    @square_index = square_index
    @cell_index = cell_index
  end

  def solved?
    @possibilities.length <= 1
  end
end


class Game
  include SudokuUtilities
  def initialize(input_string)
    @board = Sudoku.new(input_string)
  end

  def play_sudoku
    @board.solve!
    @board.print_board
    # @board.validate_solution ? @board.stringify : false
    @board.stringify
  end
end

#####################################################
# drive program from commandline for development
#####################################################

input_string = File.readlines('sample.unsolved.txt')[13].chomp
game = Game.new(input_string)
game.play_sudoku
