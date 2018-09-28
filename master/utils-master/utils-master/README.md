# utils

* collection of utilities, samples etc

# Redis

* It supports multiple databases
* Listens to clients on one port, speaks to other nodes via another (+10000)
* supports dev friendly [data-types](http://redis.io/topics/data-types-intro) : list, capped lists, sets, sorted sets, hashes, bit arrays, hyperloglogs
* Lua scripting support
* expires feature : automatically expire data
* Mass insertion of data : bulk upload
* supports transactions : atomic changes to the cache
* survives restarts. persists data to disk
* supports compressions of data in memory/or at disk
* redis-cli supports scriptable execution, monitoring, statistics, latencies, take snapshots(as a cron job, say) etc.
* master-slave (1-n) is supported. Once master stops, one of the slave needs to be promoted as master. This can be done manually or via sentinel/clustering.
* In its source repo, there are unit tests to sanity test cluster. performance benchmarking scripts etc.
* One can listen to all the changes in any node, 'redis-cli --slave <master-node>'

## cluster

* Multiple database options is not supported if cluster is enabled.
* Operations across multiple keys spread across nodes are not supported.
* Each master can have multiple slaves. In case, master goes down, cluster shall promote one of the slave automatically.
* There are 16384 hash slots to which all the keys are assigned to. They are partitioned amongst the master nodes.
* For the cluster to be functional, all the hash slots should be available. If its not, cluster shall cease to honour read/writes.
* In case of a network partition, if one of the nodes doesnt communicate with the cluster. After a timeout (specified in conf), it shall cease to honour read/writes.
* Its not strongly consistent. The master-slave replication happens asynchronously. Hence, if master goes down before replicate is completed across all the slaves. The newly promoted slave may not possess the changes.
* Also, during network partitioning, there might exist multiple masters for same hash slots. On partition healing, the majority network's master shall prevail over the minor network's master. Thereby, those changes shall be lost.
* nodes can be added/removed from a cluster without any downtime.
* The client-cluster communication follows client-routing. Client send read/write request to one of cluster master, it either sends back the result or redirects client to the key's hash slot owner master node. Client develops the hash slot map at its side and maintains it.

* steps to create a cluster:
	- create master nodes
	- execute 'cluster meet <other-master-ip> <port>' meet at one of the master to merge it into a cluster
	- assign the hash slots to each of the master nodes via 'cluster addslots' command

* [steps](https://www.javacodegeeks.com/2015/09/redis-clustering.html) to add a node
	- create a node
	- merge it into cluster
	- decide on the hash slot(s) which need to be migrated

	- for each hash slot
	- @current owner: execute 'cluster setslot <hash-slot> migrating <new-owner-node>'
	- @new owner, execute 'cluster setslot <hash-slot> importing <current-owner-node>'
	- During this time, if client interacts for a key, the current owner shall check if the key is available with it. else, redirect to the new owner.
	- @current owner, migrate individual keys to new owner 'migrate <new-master> <ip> <key> 0 0'
	- after all the keys are migrated, @current owner, execute 'cluster setslot <hash-slot> node <new-master-node>'

* steps to remove a node
	- node needs to be removed manually, since cluster might assume that node is unavailable due to network partitions.
	- its steps are also a bit tedious

* Since, above process is cumbersome, redis offers redis-trib.rb(ruby script) to do it automatically
	- create cluster
	redis-trib.rb create --replicas 1 host-ip-1:port1 host-ip-2:port2 host-ip-3:port3 host-ip-4:port4 host-ip-5:port5 host-ip-6:port6
	- migrate slots, followed by Q&A
	redis-trib.rb reshard
	- del a node
	redis-trib.rb del-node <any-cluster-master> <node-id>
	- add a node (make sure, its empty, cluster nodes are empty etc)
	redis-trib.rb add-node new-host-ip:port <any-cluster-master>
	- rebalance the slots amongst the masters
	redis-trib.rb rebalance --use-empty-masters <any-cluster-master>

### Make a cluster node slave

```
cluster replicate <master-node-id>
```

* **references**
	- http://redis.io/topics/cluster-tutorial

## [sentinel](http://redis.io/topics/sentinel)

* Its a monitoring, notification system. It provides automatic failover of the master-slave configuration.
* One needs to run multiple(>=3) sentinels to ensure HA of sentinels.
* It regularly updates its config file which tracks the current master. So that on restart, the info is not lost.
* It is not required if we are using redis clustering
* It offers pub/sub facility where we could listen to updates in the network topology and take appropriate actions

## client libraries
* Python libraries
	- redis-py : tried and tested, but without clustering support
	- [redis-py-cluster](https://github.com/Grokzen/redis-py-cluster) : with clustering support
* C++ : dont know

## References
- [documentation](http://redis.io/documentation)
- [consistency-check script](https://github.com/antirez/redis-rb-cluster.git)
