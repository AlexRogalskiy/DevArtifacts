# main function
# solve_sudoku() completes sudoku grids initially by using the simple sudoku
# solver (complete_simple_sudoku()) and then, when this can no longer provide
# solutions, by using try_number() to add different numbers in the empty 
# positions of the grid and check if the grid is valid.

from simple_sudoku_solver import complete_simple_sudoku
from functions_solve_sudoku import find_empty
from functions_solve_sudoku import try_number


def solve_sudoku(grid):

	list_attempts = []
	grid = complete_simple_sudoku(grid)

	# grid is incorrectly formed
	if grid is None or grid is False:
		return grid

	position = [0,0]

	# until grid is complete
	while grid is not False and position is not None:

		position = find_empty(grid)	
		
		if position is not None:
			grid = try_number(grid, position, list_attempts)
			#print list_attempts	

	return grid
