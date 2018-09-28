#!/usr/bin/env python

# Script Name : redis-master-client
# Author : amit.handa
# Created : 14.11.16
# Version : 1.0
# Description : master script to fork multiple redis-clients

import os, time, threading, signal, logging
import sys
import redis
from rediscluster import StrictRedisCluster

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] (%(threadName)-10s) %(message)s',)

def client( cid, *clients ):
    chandles = []
    for c in clients:
        chandles.append( redis.Redis( host = c[0], port = c[1] ) )

    logging.debug( 'client %d connected to redis servers' % cid )
    count = 0
    while True:
        time.sleep( 1 )
        count+=1
        print 'client: %d, servers value are ' % (cid,),
        for i in range( len( chandles ) ):
            chandle = chandles[i]
            if i == 0:
                chandle.set( cid, count )
            v = chandle.get( cid )
            print v,
        print "end"

def threadedClient( cid, clients ):
    chandles = []
    for c in clients:
        chandles.append( redis.Redis( host = c[0], port = c[1] ) )

    logging.debug( 'client %d connected to redis servers' % cid )
    count = 0
    while True:
        time.sleep( 1 )
        count+=1
        print 'client: %d, servers value are ' % (cid,),
        for i in range( len( chandles ) ):
            chandle = chandles[i]
            if i == 0:
                chandle.set( cid, count )
            v = chandle.get( cid )
            print v,
        print "end"

def threadedClientWithCluster( cid, clients ):
    hclients = [ { 'host' : c[0], 'port' : c[1] } for c in clients ]
    credis= StrictRedisCluster( startup_nodes=hclients )

    logging.debug( 'client %d connected to redis servers %s' % (cid, hclients) )
    count = 0
    while True:
        time.sleep( 1 )
        count+=1
        print 'client: %d, servers value are ' % (cid,),
        credis.set( cid, count )
        v = credis.get( cid )
        print v,
        print "end"

def main():
    logging.debug( "Hello %s %s" % ( sys.argv[1], sys.argv[2] ) )
    os.setpgrp()    # create new proc group, become its leader
    try:
        if len( sys.argv ) < 3:
            print """
            program <numClients> <aliveSecs> <comma-sep-redis-servers>
            program 2 30 ip1:9903,ip2:9904
            """
            os._exit( 1 )

        redisServers = parseConfig( sys.argv[3] )
        #print "parsed servers ", redisServers

        """
        for i in range( int( sys.argv[1] ) ):
            pid = os.fork()
            if pid == 0:
                client( i, *redisServers )
            else:
                #pids = (os.getpid(), pid)
                print "parent: child: %s" % pid
        """

        for i in range( int( sys.argv[1] ) ):
            newthread = threading.Thread( target=threadedClientWithCluster, args=(i,redisServers) )
            newthread.start()

        logging.debug( "KILL after %s seconds !!!!!" % sys.argv[2] )
        time.sleep( int( sys.argv[2] ) )
    except:
        logging.error( "ERRRRROR ! %s" % sys.exc-info()[0] )
    finally:
        logging.debug( "KILLLLLLLLLLING" )
        os.killpg( 0, signal.SIGKILL )  # kill all procs in my group

def parseConfig( csvServers ):
    # type: (str) -> list
    pcsvServers = csvServers.split( ',' )
    return [ csvserver.split(':') for csvserver in pcsvServers ]

if __name__ == '__main__':
    main()

