// srvr.c

//  a server to remotely run the w command
//  user can check load on machine without login privileges
//  usage:  svr

#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <fcntl.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>

#define WPORT 2000  
#define BUFSIZE 1000  // assumed sufficient here

int clntdesc,  // socket descriptor for individual client
    svrdesc;  // general socket descriptor for server 

char outbuf[BUFSIZE];  // messages to client 

void respond()
{  int fd,nb;
        
   memset(outbuf,0,sizeof(outbuf));  // clear buffer 
   system("w > tmp.client");  // run 'w' and save results
   fd = open("tmp.client",O_RDONLY);
   nb = read(fd,outbuf,BUFSIZE);  // read the entire file
   write(clntdesc,outbuf,nb);  // write it to the client
   unlink("tmp.client");  // remove the file
   close(clntdesc);
}

int main()
{  struct sockaddr_in bindinfo;

   // create socket to be used to accept connections
   svrdesc = socket(AF_INET,SOCK_STREAM,0);
   bindinfo.sin_family = AF_INET;
   bindinfo.sin_port = WPORT;
   bindinfo.sin_addr.s_addr = INADDR_ANY;
   bind(svrdesc,(struct sockaddr *) &bindinfo,sizeof(bindinfo));

   // OK, listen in loop for client calls 
   listen(svrdesc,5); 
   
   while (1)  {
      // wait for a call 
      clntdesc = accept(svrdesc,0,0);
      // process the command 
      respond();
   }
}
