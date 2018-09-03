package ua.maxtmn;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Date;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import ua.maxtmn.executor.VowelsCounter;
import ua.maxtmn.util.FileHelper;

/**
 * java -jar vowels-counter.jar C:\INPUT.TXT C:\OUTPUT.TXT
 * 
 * @author Tereshchenko
 * 
 */
public class Application {

	public static void main(final String[] args) throws InterruptedException,
			ExecutionException, IOException {
		if (!readAndValidateParams(args)) {
			System.exit(1);
		}
		final Path pathToFile = Paths.get(args[0]);
		final Path pathToDestinationFile = Paths.get(args[1]);
		System.out.println("Evaluation started:" + new Date());

		final Collection<String> inputData = FileHelper
				.readWordsFromFile(pathToFile);
		boolean isDecoratedResult = false;
		if (args.length > 2) {
			isDecoratedResult = Boolean.parseBoolean(args[2]);
		}

		if (isDecoratedResult) {
			System.out.println("Be patient, we are beautify response for you.");

			final Future<Collection<String>> calculation = Executors
					.newSingleThreadExecutor().submit(
							new Callable<Collection<String>>() {
								@Override
								public Collection<String> call()
										throws Exception {

									return VowelsCounter
											.countAverageVowelsInWords(inputData);

								}
							});

			long start = System.nanoTime();
			final Collection<String> result = calculation.get();
			System.out.println("computition ended in: "
					+ TimeUnit.MILLISECONDS.convert(
							(System.nanoTime() - start), TimeUnit.NANOSECONDS)
					+ " milliseconds");
			Future<Boolean> resultSaving = Executors.newSingleThreadExecutor()
					.submit(new Callable<Boolean>() {
						@Override
						public Boolean call() throws Exception {

							return FileHelper.writeResultToFile(
									pathToDestinationFile.toString(), result);

						}
					});
			{
				System.out.println("Writing file is in progress...");
			}
			while (!resultSaving.get())
				;
		} else {
			System.out.println("you have choose no-decorating for response.");
			final Future<Collection<String>> calculation = Executors
					.newSingleThreadExecutor().submit(
							new Callable<Collection<String>>() {
								@Override
								public Collection<String> call()
										throws Exception {

									return VowelsCounter
											.countAverageVowelsInWordsPure(inputData);

								}
							});

			long start = System.nanoTime();
			final Collection<String> result = calculation.get();
			System.out.println("computition ended in: "
					+ TimeUnit.MILLISECONDS.convert(
							(System.nanoTime() - start), TimeUnit.NANOSECONDS)
					+ " milliseconds");

			Future<Boolean> resultSaving = Executors.newSingleThreadExecutor()
					.submit(new Callable<Boolean>() {
						@Override
						public Boolean call() throws Exception {

							return FileHelper.writeResultToFile(
									pathToDestinationFile.toString(), result);

						}
					});
			{
				System.out.println("Writing file is in progress...");
			}
			while (!resultSaving.get())
				;

		}

		System.out.println("Evaluation ended:" + new Date());
	}

	/**
	 * Validates the commandline arguments.
	 * 
	 * @return True if they are OK
	 */
	private static boolean readAndValidateParams(String[] args) {
		// length check
		if (args.length < 2) {
			System.err.println();
			System.err.println("Wrong number of arguments");
			System.err.println();
			System.err
					.println("Usage: java -jar vowels-counter.jar <pathToRead> <pathToWrite> <toBeautifyResponse>");
			System.err
					.println("toBeautifyResponse - boolean true/false - optional. Used to increase performance. Gives aprox twice faster calculation.");
			System.err.println();
			return false;
		}

		return true;
	}
}
