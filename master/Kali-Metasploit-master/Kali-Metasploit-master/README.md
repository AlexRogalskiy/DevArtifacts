

#Dockerfile to create a Kali + Metasploit Container


Based on official Kali Docker File.

Create the docker container with docker build command as per docker documentation
Then run:

docker run --net=host -t -i linux/kali/metasploit


