DISCLAIMER (READ FIRST!)
------------------------

I, the author, am not responsible for any damages that running, using, or even
downloading this program incurs. If your toaster explodes killing your dog, 
that's real tough luck, and i'm simply not repsonsible. By downloading this
program you agree to read this file first; by reading this file you agree to
be bound by the terms outlined in this paragraph before you use the program;
by using this program you free me of any liability towards you, the user.

License-wise this software is protected by the GNU Public License (GPL), see 
LICENSE.txt for more information.

I am in no way affiliated with webcamXP, webcamXP-PRO, tanukisoftware; these 
are names copyrighted and trademarked by their respective owners.




WTF IS wxpRelay ?!
------------------


Good question. 

Brief terminology: 
- the "cam PC" is the computer that has the webcam attached to it with a legal
version of webcamXP-PRO (or any program that serves a series of JPGs on a given 
port in HTTP)
- the "server PC" is a computer that is either connected directly to the 
internet (not behind a hardware firewall/router of any sort), or is behind a 
firewall/router that you have administrative access to.

wxpRelay is for anyone who doesn't have control of the router that their cam PC 
is behind, but who do have control of another computer that fits the description 
of the server PC.  Say you have a laptop with a webcam, and you go off for a  
vacation in New Brunswick to the town of Fredericton, where there is bountiful 
free wireless internet. You could easily run webCamXP on your laptop and have it 
upload pictures to your website via HTTP POST or FTP, no problemo. But, if you 
wanted to allow people to see live video, how would you do it? You don't have 
access to the City of Fredericton's wireless routers, so you can't forward any 
ports through to you -- no one can make an incoming connection to you, your 
laptop has to make the outgoing connection first. That's where wxpRelay comes 
in; wxpRelay allows you to have incoming connections for video even in 
situations like the above.

One of the really useful features of wxpRelay is that all bandwidth is used at 
the server, ie. if three people are requesting video all at the same time when 
wxpRelay is being used, the video is replicated on the server PC, so only one 
connection to the cam PC is ever used. This is good because if the cam PC is 
wirelessly roaming as above, it'll probably have reduced bandwidth so you 
don't want any more than 1 stream of video emanating from it.


REQUIREMENTS
------------

- a webcam program that provides quickly changing jpgs and has its own 
web-server; webcamXP is recommended but many programs do this
- Java. I use J2SE 5.0 update 1 but only JRE 1.2 is required; see the how to
run section for more info if you don't understand what I mean. The class files
the package comes with have been compiled with backwards compatibility for Java
JRE 1.2, so you don't have to upgrade on my behalf.



HOW DOES wxpRelay WORK?
-----------------------


wxpRelay is comprised of three parts:
1. the HttpServer, which runs on the server PC
2. the ControlServer, which runs on the server PC
3. the client, which runs on the cam/client PC

These roles are described as follows:
- the HttpServer takes incoming requests from the internet when Joe Schmoe says 
"gimme your video feed" by using his browser (Internet Explorer, Firefix, etc), 
and gives back a series of JPGs that create video. This is pretty much exactly 
the same thing that webCamXP PRO's web-server does. By default the HttpServer 
runs on port 8080 (just like webCamXP PRO's web-server does), but you can change 
this (read on)
- the ControlServer receives the stream of JPGs directly from the client, and 
brokers them to the HttpServer. As mentioned earlier, there's only ever one 
stream of video going from the client to the ControlServer
- the client sits on the cam PC, repeatedly grabbing pictures from webCamXP-PRO's 
internal server, and sending them to the ControlServer.

Now for some nitty gritty details; let's talk about a request for video from the
internet and how things happen.

First, even before the request, the server and client get started up. When the 
server starts, it starts the ControlServer and HttpServer, each listening on a 
separate port. The HttpServer will take an incoming HTTP request, and give back
a JPG: if the client hasn't connected yet then it'll send the offline jpg; if
the client is connected it'll first send the loading jpg and then start sending 
live jpgs. It does this by telling the ControlServer that someone is requesting
video, so the ControlServer tells the client to start sending jpgs. Since there's
no way with HTTP to know when people have stopped requesting video, there's a 
timer that goes off every 5 seconds; if it detects that no one has requested a jpg
in that time it sets the state as unrequested, which means that the ControlServer
drops the connection to the client. The client will immediately reconnect.

If at any point something goes wrong (say the cam PC is a laptop and loses WiFi
connectivity), then the ControlServer goes back to waiting for a connection, and
the client tries to initiate an outgoing connection to the ControlServer every 
60 seconds.




LIMITATIONS
-----------


The HttpServer is not a real HTTP server. It only sends jpgs, it doesn't actually
understand the HTTP protocol -- it doesn't even bother understanding the HTTP text
that a web-browser sends it.

You have to use wxpRelay with a webcam program that has its own HTTP server built-in,
and serves up jpgs (not some other kind of video like MPEG video or whatever). I 
use webcamXP-PRO, a fantastic program you can try/buy from http://www.webcamxp.com

No sound - wxpRelay doesn't do audio of any sort. Maybe in a later version if enough
people request it.



HOW TO RUN / USE
----------------

PART A: GETTING JAVA

First, if you don't hava Java, get Sun's implementation of Java. A quick explanation
of terms that Sun uses:
	- J2SE - the Java 2 Standard Edition, which is what you want. Ignore the '2'.
	- JRE - Java Runtime Environment - A distribution of the J2SE, this is what 
you want if you're running compiled java code, not compiling your own. So, if you're 
just using wxpRelay but not making any changes to the .java files, then this is the 
one for you.
	- JDK - Java Development Kit - A distribution of the J2SE, this is what you 
want if you're compiling any java code, like changing wxpRelay's .java files. Note 
that the JDK contains the JRE so you don't need both.

So, go grab the newest version of the JRE or JDK as you see fit, which are free from 
http://java.sun.com . Install it as per Sun's instructions, and then make sure it's
in the path; to test this start a command prompt in Windows or a shell in Linux, and
type "java". If you get java's cmd-line options, you have it in the path. Note that 
versions before 1.5 (aka 5.0) of Java didn't add themselves to the path, but it seems
like 1.5 (aka 5.) does, nice.


PART B: RUNNING wxpRelay

**IMPORTANT: READ THIS BEFORE ATTEMPTING TO RUN wxpRelay!**
There are two ways to run wxpRelay: from the cmd-line, or as a Windows service. The
latter is accomplished by using "Wrapper", an open-source program found here:
http://wrapper.tanukisoftware.org

I have spent painstaking hours setting up wrapper for you. Granted it should have 
been easy but I made a stupid mistake and it took ages to figure out how to configure
it properly :) Needless to say, it's all done for you. So, here's how you do either:

1) RUNNING wxpRelay FROM THE CMD-LINE

I'm guessing that the majority of you aren't familiar with Java, so i've created
batch and shell files you can run. You absolutely must run them from the directory
they are in (this must be their "start dir"), and they assume that the executable 
"java" is in the path.

If you're in Windows you can type either:

CMD-LINE: STARTING THE CLIENT

startClient.bat myhost.dyndns.org 8071 true localhost:8080
... where:
	myhost.dyndns.org is the IP of the Server (computer w/ Control+HtppServers)
	8071 is the ControlServer port (chosen when you start the Server)
	true is the debugging level, either "true" or "false"; false will report only
		errors and serious things that go wrong, true gives enough to debug
	localhost:8080 is the IP and port (must be in IP:port form) of the webCamXP 
		or other JPG-serving webcam HTTP server. Note that you could have this
		residing on a machine other than where the Client runs, but I don't 
		see why you'd want to do this.

CMD-LINE: STARTING THE SERVER (ControlServer, HttpServer, all Server components)

startServer.bat 8070 8071 true
... where:
	8070 is the port the HttpServer listens on, ie. where you're going to direct
		incoming requests from the internet to (you are choosing it here)
	8071 is the ControlServer port (you are choosing it here)
	true is the debugging level, as explained above

If you're in Linux (java must still be in the path!), then the commands are exactly the
same, except replace .bat with .sh

By default the output of wxpRelay is to standard output (stdout); if you want this to
go to a file "wxpOutput.txt", overwrite Logger.java with Logger.java.toFile and re-
compile.


2) USING WRAPPER TO RUN wxpRelay AS A WINDOWS SERVICE

** If you use this, please consider a donation to the Wrapper project! See
   http://wrapper.tanukisoftware.org for details.

Note that this probably requires Windows NT/2000/XP/2003 or newer.
I recommend you get things working from the cmd-line first! Then try the service...

- First you have to configure the settings properly. Go into the conf/ directory, and 
you'll find two files, one obviously for the server, the other for the client. Open
the appropriate one in a text-editor, and find the clearly spaced section that has 
# wxpRelay users ... 
... as the comment. You need to set the options here; they are exactly the same as
the options when you run wxpRelay from the cmd-line, so refer above to see what all
the parameters are/do.

- Next you need to install the service itself. Go into the bin/ directory and execute
the appropriate Install-wxpRelay-service-* batch file. That'll make your service.

- Now you can try starting the service. In Windows XP (and possibly 2k?) go start, 
run, and type in "services.msc". Up pops the services window. Start up the service
you've just installed, which will be wxpRelay(client or server).

The output is going to logs/wrapper.log ! If things start going wrong, that's where
to look.

An important note: should you want to change the files in conf/ and you've already 
installed the service(s), it is VITAL that you uninstall the service(s) first BEFORE
modifying the conf files! To do this, use the Uninstall-wxpRelay-service-* batch files.
After you've uninstalled the service(s) you can modify the conf/ files, and reinstall
if desired.

Don't pester me with wxpRelay-running-as-a-windows-service problems, it'll be a 
Wrapper related issue. You can check their website for help (address above).


PART C: TRYING IT OUT!

So you've got the client hooked up with webcamXP on one computer and the server running
on another, and you want to try it out? I've included a modified version of an HTML file
that webcamXP comes with, which you can use as a starting point. It's in the resources/
directory and it's called wxpRelaySampleHTML.html, and you need to change one thing in it.
Change the localhost:8070 part on this line:
	var wxpHost = "http://localhost:8070/";
... to reflect the Server IP:port of the machine the Server is running on. Then, try 
loading this up in your browser, from any machine you want. If everything works you should
see some jpg-video ! If not take a look at the output from the Client and Server, and see
if you can spot anything you missed.

You can use the jpg stream any way you see fit. One way (like the sample html talked about
above) has an HTML file repeatedly pulling jpg data, another would be to write your own 
front-end that uses HTTP to grab the jpgs whenever you need; this method is simpler than
it sounds, because the HttpServer isn't actually doing real HTTP, it's sending the same
jpg response every time (see limitations section for more details). Experiment!




CONFIGURABLE THINGS (COMPILE-TIME SETTINGS)
-------------------------------------------


There are a few things that are configurable other than the options taken as runtime
parameters (see how to run section). They are broken up into the files they are found
in. Note that if you change any of 'em, you've gotta recompile (out of scope of this 
document)

ControlServer.java:
    public final static long CAM_TIMEOUT_MILLIS = 5000;
This is the timeout in milliseconds after the last person requests a jpg from the
HttpServer that the system drops the connection to the client (stops receiving jpgs)

    public final static int KEEPALIVE_TIMEOUT = 5;
The number of seconds until a keepalive packet is sent from the ControlServer to the
client, to make sure the connection isn't dropped

    public final static int MAX_JPG_SIZE = 20000;
This is the largest size jpg that the system will deal with. There is about 1k of 
overhead, so add 1k to what you'd put here. My webcam using webcamXP-PRO takes jpgs
that are about 10k or less in size, so 20k is a safe setting. The only benefit of 
setting this as low as possible is a slight memory efficiency (only 3 or 4 times this
amount are ever allocated simultaneously).

Messages.java:
    public static final int BUFFER_SIZE = 1024;
This is the amount of data that's sent in a single TCP packet from the client to 
the ControlServer or from the HttpServer to someone's browser.

ClientMain.java:
    public static final int RANDOM_SEED = 12745;
A seed for the random number generator, no need to change this

    public static final int ERROR_THRESHOLD = 10;
The number of socket recv/send errors before dropping the connection

By default the output of wxpRelay is to standard output (stdout); if you want this to
go to a file "wxpOutput.txt", overwrite Logger.java with Logger.java.toFile and re-
compile.


DONATIONS
---------

If you find this software useful, feel free to make a donation to help me pay off
my student loans. If you're a student, I forbid you from doing so :) Any size 
donation is welcome and appreciated!

You can donate to me using PayPal, my email/userid is cygnusx__1@hotmail.com (note
the double-underscore). Or, you can find a link to do so directly from my website
on the USB keyfob page: http://fuzzymunchkin.dyndns.org/tdot/usbkeyfob/index.php3

Thanks!



TROUBLESHOOTING
---------------


Q: On Windows, why do I get "Address already in use: connect" and/or 
"received was <=0 (end of stream) in receiveString()" ?

A: Because you are probably using the program on a LAN, and getting very fast
speeds; this uses ports faster than Windows can handle. Windows will be using
ephemeral ports (temp ones) between 1024-5000, and those ports have a default
timeout after they are closed of 4 minutes; therefore if you exhaust those ~4k 
ports in < 4 minutes (very easy, I do so on my Windows machine in <1min!) then 
you start getting these errors. The solution, if necessary for further testing 
on the LAN, is to either change what constitutes an ephemeral port, or making 
the timeout shorter. For testing purposes I set the timeout on my Windows XP 
computer to 30 seconds, and this problem was fixed. You can find out how to 
do those things here:

http://support.microsoft.com/default.aspx?scid=kb;EN-US;196271
http://support.microsoft.com/kb/149532/EN-US/


Q: I get the same picture again and again / the video isn't changing
A: Probably because webcamXP has gone wrong. Ensure that your cam is properly
connected to webcamXP; try restarting webcamXP. For example, disconnecting your
cam and reconnecting it will cause this to happen on my version of webcamXP


Q: Help ! It just doesn't work for me !
A: You can try emailing me. Remember to include all the relevant info, such as 
version of webcamXP or other program, the logs of wxpRelay (have it write to
wxpOutput.txt and send me that), the detailed explanation of what you think should
happen that doesn't, or what is happening that shouldn't, etc. My address is
rush2112 at gmail DDDDOT com.





</documentation>, sleep++;


