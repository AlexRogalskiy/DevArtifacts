int *x;

main()
{
	int y;
	x = (int *) malloc( 25*sizeof(int) );
	scanf("%d%d", &x[3], &x[8]);
	y = x[3] + x[8];
	printf("%d\n", y);
}
