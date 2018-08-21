package com.example.avroSample.mapReduce;

import java.io.IOException;

import org.apache.avro.mapred.AvroCollector;
import org.apache.avro.mapred.AvroReducer;
import org.apache.avro.mapred.Pair;
import org.apache.hadoop.mapred.Reporter;

public class ModelCountReducer extends
		AvroReducer<CharSequence, Integer, Pair<CharSequence, Integer>> {

	/**
	 * This method "reduces" the input
	 */
	@Override
	public void reduce(CharSequence modelName, Iterable<Integer> values,
			AvroCollector<Pair<CharSequence, Integer>> collector, Reporter reporter)
			throws IOException {
		
		int sum = 0;
		
		for (Integer value : values) {
			sum += value.intValue();
		}
		
		collector.collect(new Pair<CharSequence, Integer>(modelName, sum));
		
	}

}
