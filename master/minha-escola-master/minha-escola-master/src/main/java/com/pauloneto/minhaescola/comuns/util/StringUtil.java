package com.pauloneto.minhaescola.comuns.util;

public class StringUtil {

	private StringUtil() {
		super();
	}

	/**
	 * 
	 * Este método verifica se um valor está preenchido (valor.trim().length()
	 * != 0) retornando true, em caso afirmativo, ou false, caso contrário.
	 * 
	 * @author Paulo Neto - pasvsi@gmail.com
	 * 
	 * @param valor
	 *            valor a ter seu preenchimento verificado.
	 * @return true, caso o valor seja preenchido, ou false, caso contrário.
	 * 
	 */
	public static boolean valorPreenchido(String valor) {

		return ((valor != null) && (valor.trim().length() != 0));

	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com Este método verifica se o valor é
	 *         NULL, caso seja é retornado um vazio, caso contrario é retornado
	 *         o valor do objeto
	 * 
	 * @param valor
	 * @return string
	 */
	public static String valorNullRetornaVazio(String valor) {

		if (valor != null) {
			return valor.trim();
		}

		return "";
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com 
	 * Objetivo: Dada uma String de tamanho x, ele preenche com o 
	 * caracter passado Até que a a string fique do 
	 * tamanho y passado por parametro
	 * 
	 * Exemplo: Entrada - ("123", '0', 6) Saida - "000123"
	 * 
	 * @param
	 * @return
	 * @throws
	 */
	public static String completaStringCaracterEsquerda(String palavra,
			char caracter, int tamanho) {

		int count = tamanho - palavra.length();

		for (int i = 0; i < count; i++) {
			palavra = caracter + palavra;
		}
		return palavra;
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com 
	 * 
	 * @param
	 * @return
	 */
	public static String removePonto(String string) {

		String stringAux;

		stringAux = (string.contains(".") || string.contains(",")) ? string
				.replace(".", "") : string;

		return stringAux;
	}

}
