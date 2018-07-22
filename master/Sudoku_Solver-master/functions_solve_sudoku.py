from check_sudoku import check_sudoku
from simple_sudoku_solver import complete_simple_sudoku
from simple_sudoku_solver import check_incomplete

# functions complete sudoku

# identifies empty positions in the grid
def find_empty(grid):

	count_row = 0

	for row in grid:
		count_column = 0

		for num in row:
			if num == 0:
				return [count_row, count_column]

			count_column = count_column + 1
		count_row = count_row + 1

	return None

# adds different numbers to an empty position in the grid and 
# returns grid once a valid number is found. Each new valid 
# number is recorded in a list.
def try_number(grid, position, list_attempts):

	isValid = False
	num = 0

	# try all numbers 1-9 in position of grid
	while not isValid and num <= 9:

		num = num + 1
		
		grid[position[0]][position[1]] = num
		isValid = check_sudoku(grid)

		# not found valid number for position
		if num >= 9 and not isValid:
				
			# delete previous entry in grid and try to find another valid number for previous position
			if len(list_attempts) is not 0:

				# reset grid position to empty
				grid[position[0]][position[1]] = 0

				#delete last entry in grid and try next number
				num = list_attempts[-1][0]
				position[0] = list_attempts[-1][1]
				position[1] = list_attempts[-1][2]

				del list_attempts[-1]

				#print 'del', num

			# no possible valid number found => grid cannot be completed
			else:
				return False

	list_attempts.append([num, position[0], position[1]])

	return grid
