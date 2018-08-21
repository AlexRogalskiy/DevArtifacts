package com.javainuse.main;

import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;

public class MainClass {
	public static void main(String[] args) {
		HazelcastInstance hz = Hazelcast.newHazelcastInstance();
	}
}
