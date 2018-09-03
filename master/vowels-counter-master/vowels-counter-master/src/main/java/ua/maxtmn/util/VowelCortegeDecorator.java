package ua.maxtmn.util;

public class VowelCortegeDecorator {

	private final String result;

	public VowelCortegeDecorator(String result) {
		super();
		this.result = result;
	}

	public static String decorateResult(String result) {
		if (result == null) {
			return "";
		}
		return result.replace("[", "{").replace("]", "}");
	}

	@Override
	public String toString() {
		if (result == null) {
			return "";
		}
		return "("
				+ result.replace("=", ", ").replace("[", "{").replace("]", "}")
				+ ")";
	}
}
