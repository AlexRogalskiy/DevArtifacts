package ua.maxtmn.executor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeSet;

import ua.maxtmn.util.VowelAverageDecorator;
import ua.maxtmn.util.VowelCortegeDecorator;

public class VowelsCounter {

	public static Collection<String> countAverageVowelsInWords(
			Collection<String> words) {
		return VowelsCounter.decorateVowelsResult(VowelsCounter
				.countVowels(words));

	}

	public static Collection<String> countAverageVowelsInWordsPure(
			Collection<String> words) {
		return VowelsCounter.countVowels(words);

	}

	private static Collection<String> countVowels(Collection<String> words) {
		Map<String, List<Integer>> result = new HashMap<String, List<Integer>>();
		for (String word : words) {
			Set<String> charset = new TreeSet<>();
			int vowels_quantity = 0;
			int wordLength = word.length();
			for (char ch : word.toCharArray()) {
				if (isVowel(ch)) {
					vowels_quantity++;
					charset.add(Character.toString(ch).toLowerCase());
				}

			}
			if (vowels_quantity != 0) {
				countAverageVowels(result, charset, vowels_quantity, wordLength);
			}

		}
		Set<String> response = new TreeSet<String>();

		for (Entry<String, List<Integer>> entry : result.entrySet()) {
			List<Integer> clst = entry.getValue();
			float sum = 0;
			for (Integer integer : clst) {
				sum += integer;
			}
			response.add(entry.getKey() + " -> " + sum / clst.size());
		}
		return response;

	}

	private static void countAverageVowels(Map<String, List<Integer>> result,
			Set<String> charset, Integer count, int wordLength) {
		String key = charset.toString() + ", " + wordLength;

		if (!result.containsKey(key)) {
			List<Integer> c = new ArrayList<Integer>();
			c.add(count);
			result.put(key, c);
		} else {
			result.get(key).add(count);
		}

	}

	private static Collection<String> decorateVowelsResult(
			Collection<String> result) {
		Collection<String> decoratedResult = new TreeSet<String>();
		for (String entry : result) {
			decoratedResult.add(VowelAverageDecorator
					.decorateResult(VowelCortegeDecorator.decorateResult(entry
							.toString())));
		}
		return decoratedResult;
	}

	private static boolean isVowel(char ch) {
		if (ch == 'a' || ch == 'A' || ch == 'e' || ch == 'E' || ch == 'i'
				|| ch == 'I' || ch == 'o' || ch == 'O' || ch == 'u'
				|| ch == 'U') {
			return true;
		}
		return false;
	}

}
