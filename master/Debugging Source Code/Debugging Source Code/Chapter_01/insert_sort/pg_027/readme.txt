After we fixed the bug at line 30 from:

	if (num_y = 0)  { // y empty so far, easy case

to:

	if (num_y == 0)  { // y empty so far, easy case
