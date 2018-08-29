# Port scanner

### General description
Script for scanning port of a target host. It outputs open ports and their protocols.

### Requirements
- Python 3.*
    - tabulate

### Usage
To use this script you should specify next parameters:
```sh
$ sudo portscan.py [-h] [-l L] [-r R] [-t T] host
```
Notice that script have to be used with **sudo** privilege. This happens because of using raw sockets in the script.

Positional arguments:

Argument | Description
-------- | ----------
l | Lower bound of scanning ports
r | Upper bound of scanning ports (excluded)
host | Target host for scanning

Optional arguments:

Argument | Description
-------- | ----------
-h, --help | Show help message
-t T | Number of threads
-sT | Scan open TCP ports
-sU | Scan open UDP ports
--smooth | Use smooth scan (if this flag isn't specified then instead will be using process pool)

### Example of using
It quite long though. Sorry ¯\\\_(ツ)_/¯
```sh
$ sudo python3 portscan.py ya.ru -l 70 -r 81

------  -----  -------
PORT    STATE  SERVICE
70\udp  open   gopher
71\udp  open   unknown
72\udp  open   unknown
73\udp  open   unknown
74\udp  open   unknown
75\udp  open   unknown
76\udp  open   unknown
77\udp  open   unknown
78\udp  open   unknown
79\udp  open   unknown
80\tcp  open   http
80\udp  open   http
------  -----  -------

```