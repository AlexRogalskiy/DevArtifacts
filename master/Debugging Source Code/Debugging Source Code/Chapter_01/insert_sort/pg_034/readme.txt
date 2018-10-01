After we fixed the bug at line 23 from:

   for (k = num_y; k > jj; k++)

to:

   for (k = num_y; k > jj; k--)
