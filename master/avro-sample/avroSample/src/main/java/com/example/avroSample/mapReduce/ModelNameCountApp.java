package com.example.avroSample.mapReduce;

import java.io.File;

import org.apache.avro.Schema;
import org.apache.avro.Schema.Type;
import org.apache.avro.mapred.AvroJob;
import org.apache.avro.mapred.Pair;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.mapred.FileInputFormat;
import org.apache.hadoop.mapred.FileOutputFormat;
import org.apache.hadoop.mapred.JobClient;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.util.Tool;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.example.avroSample.model.Automobile;

public class ModelNameCountApp extends Configured implements Tool {

	private static final Logger LOGGER = LogManager
			.getLogger(ModelNameCountApp.class);

	private static final String JOB_NAME = "ModelNameCountJob";

	@Override
	public int run(String[] args) throws Exception {

		JobConf job = new JobConf(getConf(), ModelNameCountApp.class);
		job.setJobName(JOB_NAME);

		FileInputFormat.setInputPaths(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));

		AvroJob.setMapperClass(job, ModelCountMapper.class);
		AvroJob.setReducerClass(job, ModelCountReducer.class);

		AvroJob.setInputSchema(job, Automobile.getClassSchema());
		AvroJob.setOutputSchema(
				job,
				Pair.getPairSchema(Schema.create(Type.STRING),
						Schema.create(Type.INT)));

		JobClient.runJob(job);

		return 0;

	}

	/**
	 * Creates an instance of this class and executes it to provide a call-able
	 * entry point.
	 */
	public static void main(String[] args) {

		if (args == null || args.length != 2) {
			throw new IllegalArgumentException(
					"Two parameters must be supplied to the command, input directory and output directory.");
		}
		
		new File(args[0]).mkdir();
		new File(args[1]).mkdir();

		int result = 0;

		try {
			result = new ModelNameCountApp().run(args);
		} catch (Exception e) {
			result = -1;
			LOGGER.error("An error occurred while trying to run the example", e);
		}

		if (result == 0) {
			LOGGER.info("SUCCESS");
		} else {
			LOGGER.fatal("FAILED");
		}

	}
}
