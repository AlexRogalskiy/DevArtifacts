int main( void )
{
	char* char_ptr;
	int*  int_ptr;
	int   int_array[2];

	// char_ptr points to first array element.
	char_ptr = (char*) int_array;

	// Causes int_ptr to point one byte past the start of an existing int.
	// Since an int can't be only one byte, int_ptr is no longer aligned.
	int_ptr = (int*)(char_ptr + 1);

	*int_ptr = 1;   // And this might cause a bus error.

	return 0;
}
