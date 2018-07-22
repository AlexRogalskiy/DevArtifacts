#check suduko


# SPECIFICATION:
#
# check_sudoku() determines whether its argument is a valid Sudoku
# grid. It can handle grids that are completely filled in, and also
# grids that hold some empty cells where the player has not yet
# written numbers.
#
# First, your code must do some sanity checking to make sure that its
# argument:
#
# - is a 9x9 list of lists
#
# - contains, in each of its 81 elements, an integer in the range 0..9
#
# If either of these properties does not hold, check_sudoku must
# return None.
#
# If the sanity checks pass, your code should return True if all of
# the following hold, and False otherwise:
#
# - each number in the range 1..9 occurs only once in each row 
#
# - each number in the range 1..9 occurs only once in each column
#
# - each number the range 1..9 occurs only once in each of the nine
#   3x3 sub-grids, or "boxes", that make up the board
#
# This diagram (which depicts a valid Sudoku grid) illustrates how the
# grid is divided into sub-grids:
#
# 5 3 4 | 6 7 8 | 9 1 2
# 6 7 2 | 1 9 5 | 3 4 8
# 1 9 8 | 3 4 2 | 5 6 7 
# ---------------------
# 8 5 9 | 7 6 1 | 4 2 3
# 4 2 6 | 8 5 3 | 7 9 1
# 7 1 3 | 9 2 4 | 8 5 6
# ---------------------
# 9 6 1 | 5 3 7 | 0 0 0
# 2 8 7 | 4 1 9 | 0 0 0
# 3 4 5 | 2 8 6 | 0 0 0
# 
# Please keep in mind that a valid grid (i.e., one for which your
# function returns True) may contain 0 multiple times in a row,
# column, or sub-grid. Here we are using 0 to represent an element of
# the Sudoku grid that the player has not yet filled in.

def check_sudoku(grid):   
    #check each list is correct size with an integer 0-9
    for row in grid:
        if len(row) != 9:
            return None
        
        for num in row:
            if num > 9 or num < 0:
                return None
    
    # check for duplicated numbers in each row
    for row in grid:
      list_uniq  = []
      
      for num in row:
        if num > 0:
          if num in list_uniq:
            return False 
          else:
            list_uniq.append(num)

    # check for duplicated numbers in each column
    for row in range(9):
      list_uniq  = [0]
      
      for column in range(9):
        num = grid[column][row]

        if num > 0:
          if num in list_uniq:
            return False  
          else:
            list_uniq.append(num)

    # check for duplicated numbers in each box
    row_count = 0

    while row_count < 9:
      column_count = 0

      while column_count < 9:
        list_uniq = []
        
        for row in range(row_count, (row_count + 3)):
      
          for column in range(column_count, (column_count + 3)):
            num = grid[row][column]
            if num > 0:
              if num in list_uniq:
                return False  
              else:
                list_uniq.append(num)

        column_count = column_count + 3
      row_count = row_count + 3
    
    return True