#include <signal.h>
#include <stdio.h>

void my_sigint_handler( int signum )
{
	printf("I received signal %d (that's 'SIGINT' to you).\n", signum);
	puts("Tee Hee!  That tickles!\n");
}


int main(void)
{
	char choicestr[20];
	int  choice;

	while ( 1 )
	{
		puts("1. Ignore control-C");
		puts("2. Custom handle control-C");
		puts("3. Use the default handler control-C");
		puts("4. Raise a SIGSEGV on myself.\n");
		printf("Enter your choice: ");

		fgets(choicestr, 20, stdin);
		sscanf(choicestr, "%d", &choice);

		if ( choice  == 1 )
			signal(SIGINT, SIG_IGN);  // Ignore control-C
		else if ( choice == 2 )
			signal(SIGINT, my_sigint_handler);
		else if ( choice == 3 )
			signal(SIGINT, SIG_DFL);
		else if ( choice == 4 )
			raise(SIGSEGV);
		else
			puts("What ever you say, guv'nor.\n\n");
	}

	return 0;
}
