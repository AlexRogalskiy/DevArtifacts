-- Description --
A command-line windows application to manage wireless network connections, cards and profiles. Connect to WLANs, query for RSSI, stadistics... It can be used as an example of how to use Microsoft Native Wifi API dlls from any ANSI C compatible IDE

-- Requeriments --
The only requeriments are wlanapi.dll and rpcrt4.dll. You probably have them already in your system.
If you use Windows XP, go to following URL to get wlanapi.dll:
http://www.microsoft.com/downloads/details.aspx?familyid=52a43bab-dc4e-413f-ac71-158efd1ada50

-- Usage --
Run wcm.exe from the command-line.

-- Compiling from source --
1. Install MinGw
2. Edit path
	set GCC_EXEC_PREFIX=C:\MinGW
	PATH = %PATH%;%GCC_EXEC_PREFIX%\libexec\gcc\mingw32\3.4.5
	PATH = %PATH%;%GCC_EXEC_PREFIX%\bin
3. Compile from Wifi Card Manager source folder:
	gcc -Wall -L./ wcm.c -o wcm.exe -lwlanapi -lrpcrt4
