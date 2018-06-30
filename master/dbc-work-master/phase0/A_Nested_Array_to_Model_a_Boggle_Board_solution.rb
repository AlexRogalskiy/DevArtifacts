# Solution for Challenge: A Nested Array to Model a Boggle Board. Started 2014-01-29T21:58:07+00:00

@boggle_board = [["b", "r", "a", "e"],
                 ["i", "o", "d", "t"],
                 ["e", "c", "l", "r"],
                 ["t", "a", "k", "e"]]


def create_word(board, *coords)
  coords.map { |coord| board[coord.first][coord.last]}.join("")
end

def get_row(row)
  @boggle_board[row]
end

def get_col(col)
  @boggle_board.map {|row|  row[col]}
end


#1) Access multiple elements of a nested array
puts create_word(@boggle_board, [2,2], [1,1], [2,1], [3,2], [3,3], [2,3])  #=> returns "locker"
puts create_word(@boggle_board, [2,1], [3,1], [3,2], [3,3])  #=> returns "cake"

# 2) Write a method that takes a row number and returns all the elements in the row.
p get_row(0) #=>  ["b", "r", "a", "e"]
p get_row(2) #=>  ["e", "c", "l", "r"]

#3) Write a method that takes a column number and returns all the elements in the column.
p get_col(0) #=> ["b", "i", "e", "t"]
p get_col(3) #=> ["e", "t", "r", "e"]

# Not much refactoring that I can see. This seemed unnecessarily confusing with the need to create the 
# global boggle board not matching the format of #create_word. It seems like maybe it's a trick to make 
# us think, but it's not really in line with how DBC presents challenges thus far, even when there are
# 'tricks'.