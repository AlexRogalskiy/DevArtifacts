%module fifo

%{extern char *fifo;  
extern int nfifo,
           maxfifo;  
extern int fifoinit(int);  
extern int fifoput(char);  
extern char fifoget(); %}  

extern char *fifo;  
extern int nfifo,
           maxfifo;  
extern int fifoinit(int);  
extern int fifoput(char);  
extern char fifoget(); 
