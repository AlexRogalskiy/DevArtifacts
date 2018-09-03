package ua.maxtmn.util;

public class VowelAverageDecorator {

	private final String result;

	public VowelAverageDecorator(String result) {
		super();
		this.result = result;
	}

	public static String decorateResult(String result) {
		if (result == null) {
			return "";
		}
		return result.replace("=", " -> ");
	}

	@Override
	public String toString() {
		if (result == null) {
			return "";
		}
		return result.replace("=", " -> ");
	}
}
