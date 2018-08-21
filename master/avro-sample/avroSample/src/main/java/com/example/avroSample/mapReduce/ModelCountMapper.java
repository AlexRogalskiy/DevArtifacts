package com.example.avroSample.mapReduce;

import java.io.IOException;

import org.apache.avro.mapred.AvroCollector;
import org.apache.avro.mapred.AvroMapper;
import org.apache.avro.mapred.Pair;
import org.apache.hadoop.mapred.Reporter;

import com.example.avroSample.model.Automobile;

/**
 * Class class will count the number of models of automobiles found.
 */
public final class ModelCountMapper extends
		AvroMapper<Automobile, Pair<CharSequence, Integer>> {

	private static final Integer ONE = Integer.valueOf(1);

	@Override
	public void map(Automobile datum,
			AvroCollector<Pair<CharSequence, Integer>> collector,
			Reporter reporter) throws IOException {

		CharSequence modelName = datum.getModelName();

		collector.collect(new Pair<CharSequence, Integer>(modelName, ONE));

	}

}
