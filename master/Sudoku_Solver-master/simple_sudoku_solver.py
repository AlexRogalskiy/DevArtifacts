# simple sudoku solver

# SPECIFICATION:
#
# complete_simple_sudoku() fills in sudoku grids by elimating the 
# invalid positions for each number and assessing if there are any
# unique positions in the boxes, rows or columns which can only be 
# filled by one number. It handles incomplete grids and complete 
# grids are returned as they are.
#
# check_incomplete() assess if the grid is full by counting the
# values of the rows.

from check_sudoku import check_sudoku

def complete_simple_sudoku(grid):

	# check grid is valid
	isValid = check_sudoku(grid)
	
	# grid is incorrectly formed
	if isValid is None or isValid is False:
		return isValid

	# check if grid is complete
	incomplete = check_incomplete(grid)
	finding_solutions = True

	while incomplete and finding_solutions:

		finding_solutions = False

		for i in range(1, 10):

			grid_bool = [[True,True,True,True,True,True,True,True,True],
	        			[True,True,True,True,True,True,True,True,True],
	        			[True,True,True,True,True,True,True,True,True],
	        			[True,True,True,True,True,True,True,True,True],
	        			[True,True,True,True,True,True,True,True,True],
	        			[True,True,True,True,True,True,True,True,True],
	        			[True,True,True,True,True,True,True,True,True],
	        			[True,True,True,True,True,True,True,True,True],
	        			[True,True,True,True,True,True,True,True,True]]
			
			# eliminate non valid positions for number i in boolean grid
			# check rows of grid			
			count_row = 0

			for row in grid:
				if i in row:
					grid_bool[count_row] = [False,False,False,False,False,False,False,False,False]
				else:
					count_line = 0		
					for num in row:
						if num > 0:
							grid_bool[count_row][count_line] = False
						count_line = count_line + 1
				
				count_row = count_row + 1

			# check columns of grid
			for count_column in range(9):
				with_i = False
				count_row = 0
				while not with_i and count_row < 9:
					if grid[count_row][count_column] == i:
						with_i = True
					count_row = count_row + 1

				if with_i:
					# convert column in boolean grid to False
					for count_row in range(9):
						grid_bool[count_row][count_column] = False

				else:
					for count_row in range(9):
						if grid[count_row][count_column] > 0:
							grid_bool[count_row][count_column] = False

			# check boxes of grid
			# loop over box limits
			for row_limit in range(0, 9, 3):

				for column_limit in range(0, 9, 3):

					# start checking a new box
					with_i = False
					for row_count in range(row_limit, (row_limit + 3)):

						for column_count in range(column_limit, (column_limit + 3)):
			 				if grid[row_count][column_count] == i:
								with_i = True

					if with_i:
						#convert entire box in boolean grid to false
						for row_count in range(row_limit, (row_limit + 3)):

							for column_count in range(column_limit, (column_limit + 3)):
								grid_bool[row_count][column_count] = False

					else:
						#convert filled positions in box in boolean grid to false
						for row_count in range(row_limit, (row_limit + 3)):

							for column_count in range(column_limit, (column_limit + 3)):
								if grid[row_count][column_count] > 0:
									grid_bool[row_count][column_count] = False


			# check boolean grid for valid positions
			# check rows of boolean grid
			count_row = 0

			for row in grid_bool:
				count_valid = 0
				count_line = 0
				position_valid = 0

				for isValid in row:
					if isValid:
						count_valid = count_valid + 1
						position_valid = count_line
					count_line = count_line + 1

				if count_valid == 1:
					grid[count_row][position_valid] = i
					finding_solutions = True

				count_row = count_row + 1

			# check columns
			for count_column in range(9):
				count_valid = 0
				position_valid = 0
				for count_row in range(9):
					if grid_bool[count_row][count_column] == True:
						count_valid = count_valid + 1
						position_valid = count_row

				if count_valid == 1:
					grid[position_valid][count_column] = i
					finding_solutions = True

			# check boxes
			for row_limit in range(0, 9, 3):
				for column_limit in range(0, 9, 3):
					# start checking a new box
					count_valid = 0
					column_valid = 0
					row_valid = 0
					for row_count in range(row_limit, (row_limit + 3)):
						for column_count in range(column_limit, (column_limit + 3)):
							if grid_bool[row_count][column_count] == True:
								count_valid = count_valid + 1
								column_valid = column_count
								row_valid = row_count

					if count_valid == 1:
						grid[row_valid][column_valid] = i
						finding_solutions = True

		incomplete = check_incomplete(grid)

		# check grid is valid
		isValid = check_sudoku(grid)
		
		if not isValid:
			return False

	return grid


def check_incomplete(grid):

	for row in grid:
		sum_row = 0

		for num in row:
			sum_row = sum_row + num
		
		if sum_row != 45:
			return True

	return False