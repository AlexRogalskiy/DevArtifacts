#!/usr/bin/env python

# Script Name : redis-cluster-monitor
# Author : amit.handa
# Created : 07.01.17
# Version : 1.0
# Description : redis cluster monitor

import os, time, threading, signal, logging
import sys
import redis
from rediscluster import StrictRedisCluster

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] (%(threadName)-10s) %(message)s',)

class Utils:
    """
    Utility class for misc methods
    """
    @classmethod
    def makeCluster( cls, clients ):
        hclients = [ { 'host' : c[0], 'port' : c[1] } for c in clients ]
        return StrictRedisCluster( startup_nodes=hclients )

"""
cluster_nodes: for each node
{
    'link-state': 'connected',
    'slots': [
    ],
    'host': '127.0.0.1',
    'flags': ('myself', 'slave'),
    'pong-recv': 0,
    'migrations': [
    ],
    'master': '7df051ccd2f14a64f669b8aa0cd91e8815c08355',
    'ping-sent': 0,
    'id': '12bec8b48f5de0b39d7af6e76ef23a4f028ea23c',
    'port': 9903
}

cluster_info: for each node
    '127.0.0.1: 9905': {
        'cluster_state': 'ok',
        'cluster_slots_assigned': 16384,
        'cluster_known_nodes': 4,
        'cluster_slots_fail': 0,
        'cluster_stats_messages_received': 5625,
        'cluster_size': 3,
        'cluster_current_epoch': 9,
        'cluster_stats_messages_sent': 5728,
        'cluster_slots_pfail': 0,
        'cluster_my_epoch': 6,
        'cluster_slots_ok': 16384
    },

info :	for each node
    '127.0.0.1: 9903': {
        'aof_enabled': 0,
        'db0': {
            'keys': 16100,
            'expires': 0,
            'avg_ttl': 0
        },
        'multiplexing_api': 'epoll',
        'redis_version': '3.2.5',
        'sync_partial_ok': 0,
        'loading': 0,
        'used_memory_lua_human': '37.00K',
        'total_system_memory_human': '7.70G',
        'instantaneous_ops_per_sec': 0,
        'latest_fork_usec': 0,
        'used_cpu_sys': 2.84,
        'maxmemory_human': '0B',
        'process_id': 12929,
        'repl_backlog_histlen': 0,
        'aof_current_rewrite_time_sec': -1,
        'arch_bits': 64,
        'pubsub_channels': 0,
        'instantaneous_input_kbps': 0.0,
        'client_longest_output_list': 0,
        'mem_allocator': 'jemalloc-4.0.3',
        'used_memory_rss': 12673024,
        'redis_git_dirty': 0,
        'keyspace_hits': 0,
        'aof_rewrite_in_progress': 0,
        'master_host': '127.0.0.1',
        'sync_full': 0,
        'used_memory_peak_human': '3.81M',
        'lru_clock': 7299275,
        'connected_clients': 2,
        'slave_repl_offset': 7309,
        'instantaneous_output_kbps': 0.04,
        'tcp_port': 9903,
        'master_last_io_seconds_ago': 3,
        'rdb_current_bgsave_time_sec': -1,
        'slave_read_only': 1,
        'total_commands_processed': 541,
        'aof_last_write_status': 'ok',
        'pubsub_patterns': 0,
        'aof_last_bgrewrite_status': 'ok',
        'repl_backlog_active': 0,
        'blocked_clients': 0,
        'expired_keys': 0,
        'total_system_memory': 8272183296,
        'repl_backlog_size': 1048576,
        'sync_partial_err': 0,
        'os': 'Linux4.4.0-47-genericx86_64',
        'used_memory_rss_human': '12.09M',
        'run_id': '76698e82f1626cf24bf6f9238f889642d129e522',
        'redis_build_id': 'a4e3c04b92ec3b97',
        'redis_mode': 'cluster',
        'master_link_status': 'up',
        'master_sync_in_progress': 0,
        'executable': '/home/amit/redisPOC/9903/redis-server',
        'gcc_version': '5.4.0',
        'used_memory': 3975616,
        'master_repl_offset': 0,
        'used_cpu_user': 1.43,
        'evicted_keys': 0,
        'rdb_last_save_time': 1483689027,
        'aof_rewrite_scheduled': 0,
        'hz': 10,
        'rdb_last_bgsave_status': 'ok',
        'aof_last_rewrite_time_sec': -1,
        'master_port': 9906,
        'client_biggest_input_buf': 0,
        'total_net_input_bytes': 581427,
        'rdb_bgsave_in_progress': 0,
        'rejected_connections': 0,
        'slave_priority': 100,
        'uptime_in_days': 0,
        'redis_git_sha1': 0,
        'migrate_cached_sockets': 0,
        'keyspace_misses': 0,
        'maxmemory': 0,
        'used_cpu_user_children': 0.0,
        'repl_backlog_first_byte_offset': 0,
        'used_memory_lua': 37888,
        'role': 'slave',
        'cluster_enabled': 1,
        'total_connections_received': 15,
        'config_file': '/home/amit/redisPOC/9903/9903.conf',
        'maxmemory_policy': 'noeviction',
        'used_memory_human': '3.79M',
        'used_cpu_sys_children': 0.0,
        'connected_slaves': 0,
        'rdb_last_bgsave_time_sec': -1,
        'total_net_output_bytes': 6083632,
        'used_memory_peak': 3995440,
        'uptime_in_seconds': 5<t_co>,
        'rdb_changes_since_last_save': 0,
        'mem_fragmentation_ratio': 3.19
    },
"""

class Node:
    def __init__( self ):
        self.id= self.host= self.port= self.type = ''

class Master(Node):
    def __init__( self ):
        self.range = ''

class Slave(Node):
    def __init__( self ):
        self.masterUrl=self.masterId = ''

class NodeInfo:
    def update( self, ni ):
        for prop, value in vars(self).iteritems():
            logging.debug( "%s val %s" % (prop, value) )
            if ni.get( prop ):
                setattr( self, prop, ni.get( prop ) )

    def __repr__( self ):
        props = [ "%s %s" % (p, v) for p, v in vars(self).iteritems() ]
        return ",".join( props )

class Server(NodeInfo):
    def __init__( self ):
        self.redis_version= self.redis_git_sha1= self.redis_git_dirty= self.redis_build_id= self.redis_mode= self.os= self.arch_bits= self.multiplexing_api= self.gcc_version= self.process_id= self.run_id= self.tcp_port= self.uptime_in_seconds= self.uptime_in_days= self.hz= self.lru_clock= self.config_file = ''

class Clients(NodeInfo):
    def __init__( self ):
        self.connected_clients= self.client_longest_output_list= self.client_biggest_input_buf= self.blocked_clients = ''

class Cluster(NodeInfo):
    def __init__( self ):
        self.enabled = ''

class CPU(NodeInfo):
    def __init__( self ):
        self.used_cpu_sys= self.used_cpu_user= self.used_cpu_sys_children= self.used_cpu_user_children = ''

class Memory(NodeInfo):
    def __init__( self ):
        self.used_memory= self.used_memory_human= self.used_memory_rss= self.used_memory_peak= self.used_memory_peak_human= self.used_memory_lua= self.mem_fragmentation_ratio= self.mem_allocator = ''

class Persistence(NodeInfo):
    def __init__( self ):
        self.loading= self.rdb_changes_since_last_save= self.rdb_bgsave_in_progress= self.rdb_last_save_time= self.rdb_last_bgsave_status= self.rdb_last_bgsave_time_sec= self.rdb_current_bgsave_time_sec= self.aof_enabled= self.aof_rewrite_in_progress= self.aof_rewrite_scheduled= self.aof_last_rewrite_time_sec= self.aof_current_rewrite_time_sec= self.aof_last_bgrewrite_status= self.aof_last_write_status = ''
    #TODO:aof_current_size= aof_base_size= aof_pending_rewrite= aof_buffer_length= aof_rewrite_buffer_length= aof_pending_bio_fsync= aof_delayed_fsync

class Replication(NodeInfo):
    def __init__( self ):
        self.role= self.connected_slaves= self.master_repl_offset= self.repl_backlog_active= self.repl_backlog_size= self.repl_backlog_first_byte_offset= self.repl_backlog_histlen = ''
    #slaves  # map

class Stats(NodeInfo):
    def __init__( self ):
        self.total_connections_received= self.total_commands_processed= self.instantaneous_ops_per_sec= self.total_net_input_bytes= self.total_net_output_bytes= self.instantaneous_input_kbps= self.instantaneous_output_kbps= self.rejected_connections= self.sync_full= self.sync_partial_ok= self.sync_partial_err= self.expired_keys= self.evicted_keys= self.keyspace_hits= self.keyspace_misses= self.pubsub_channels= self.pubsub_patterns= self.latest_fork_usec= self.migrate_cached_sockets = ''

class Info:
    def __init__( self ):
        self.server= Server()
        self.clients=Clients()
        self.cpu=CPU()
        self.memory=Memory()
        self.persistence=Persistence()
        self.replication=Replication()
        self.stats = Stats()

    def updateNodeInfo( self, ni ):
        self.server.update( ni )
        self.clients.update( ni )
        self.cpu.update( ni )
        self.memory.update( ni )
        self.persistence.update( ni )
        self.replication.update( ni )
        self.stats.update( ni )

class RedStats:
    """
    Fetch Redis Stats via RedisCluster
    """

    def __init__( self, redcluster ):
        self.redcluster = redcluster
	self.infos = {}	# server-url, Info

    def refresh( self ):
        """
        get redis cluster stats
        * cluster info
        * cluster nodes, has slots info
        * info : info about each node
        """
	"""
        ci = self.redcluster.cluster_info()
        logging.debug( "cluster info: %s" % ci )

        cns = self.redcluster.cluster_nodes()
        for cn in cns:  # todo
            del cn['slots']
        logging.debug( "cluster nodes: %s" % cns )
	"""

        ni = self.redcluster.info()
        self.updateNodeInfo( ni )
        logging.debug( "nodes info: %s" % self.infos )
        return self.infos

    def keepPublishing( self, refdur ):
        while True:
            try:
                d = self.refresh()
            except:
                logging.error( "error" )
            finally:
                time.sleep( refdur )

    def updateNodeInfo( self, ni ):
        for k in ni.keys():
            if self.infos.get( k ):
                self.infos.get( k ).updateNodeInfo( ni[k] )
            else:
                info = Info()
                info.updateNodeInfo( ni[k] )
                self.infos[k] = info

def main():
    logging.debug( "Hello %s %s" % ( sys.argv[1], sys.argv[2] ) )
    os.setpgrp()    # create new proc group, become its leader
    try:
        if len( sys.argv ) < 3:
            print """
            program <ref-dur-secs> <comma-sep-redis-servers>
            program 30 ip1:9903,ip2:9904
            """
            os._exit( 1 )

        refdur = int(sys.argv[1])
        redisServers = [ csvserver.split(':') for csvserver in sys.argv[2].split( ',' ) ]

        redCluster = Utils.makeCluster( redisServers )
        rs = RedStats( redCluster )

        newthread = threading.Thread( target=rs.keepPublishing )
        newthread.start()
    except:
        logging.error( "ERRRRROR ! %s" % sys.exc-info()[0] )
    finally:
        logging.debug( "Exiting" )
        #os.killpg( 0, signal.SIGKILL )  # kill all procs in my group

if __name__ == '__main__':
    main()

