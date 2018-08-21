package com.pauloneto.minhaescola.comuns.util.excecao;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SiseducaException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private List<String> parametros = new ArrayList<String>();
	private SISEDUCAValidacoes validacao;

	public SiseducaException(SISEDUCAValidacoes validacao) {
		super(validacao.getCodigoMsg());
		this.validacao = validacao;
	}

	public SiseducaException(SISEDUCAValidacoes validacao, String... params) {
		super(validacao.getCodigoMsg());
		this.validacao = validacao;
		this.parametros = Arrays.asList(params);
	}

	public SiseducaException(SISEDUCAValidacoes validacao, Throwable throwable,
			String... params) {
		super(validacao.getCodigoMsg(), throwable);
		this.validacao = validacao;
		this.parametros = Arrays.asList(params);
	}

	/**
	 * @return the parametros
	 */
	public List<String> getParametros() {
		return parametros;
	}

	/**
	 * @param parametros
	 *            the parametros to set
	 */
	public void setParametros(List<String> parametros) {
		this.parametros = parametros;
	}

	/**
	 * @return the validacao
	 */
	public SISEDUCAValidacoes getValidacao() {
		return validacao;
	}

	/**
	 * @param validacao
	 *            the validacao to set
	 */
	public void setValidacao(SISEDUCAValidacoes validacao) {
		this.validacao = validacao;
	}

	/**
	 * Retorna a pilha de erros da exceção.
	 * 
	 * @param exception
	 * @return Uma String com a pilha de erros.
	 */
	public static final String getPilhaErro(Throwable t) {
		StringWriter writer = new StringWriter();
		PrintWriter printWriter = new PrintWriter(writer);
		t.printStackTrace(printWriter);
		return writer.toString();

	}

	/**
	 * Verifica se o Throwable passado por parametro contém uma exceção do tipo
	 * {@link SiseducaException}, caso contrário retorna null.
	 * 
	 * Obs: Este método retorna o PRIMEIRO {@link SiseducaException} encontrado na
	 * stack (pilha), ou seja, o ÚLTIMO {@link SiseducaException} capturado (catch)
	 * durante o lançamento do primeiro throws.
	 * 
	 * @author Paulo Neto - pasvsi@gmail.com
	 *
	 * @param throwable
	 *            A exceção a ser analisada.
	 * @return Uma exceção de negócio ou null caso a exceção passada como
	 *         parâmetro não contenha uma instância de {@link SiseducaException}.
	 */
	public static final SiseducaException getPrimeiroSiseducaException(
			Throwable throwable) {
		SiseducaException retorno = null;
		if (throwable != null) {
			if (throwable instanceof SiseducaException) {
				retorno = (SiseducaException) throwable;
			} else {
				retorno = getPrimeiroSiseducaException(throwable.getCause());
			}
		}
		return retorno;
	}

	/**
	 * Verifica se o Throwable passado por parametro contém uma exceção do tipo
	 * {@link SiseducaException}, caso contrário retorna null.
	 * 
	 * Obs: Este método retorna o ÚLTIMO {@link SiseducaException} encontrado na
	 * stack (pilha), ou seja, o PRIMEIRO {@link SiseducaException} capturado
	 * (catch) no lançamento do primeiro throws, que provavelmente será a origem
	 * do erro. Este método é util para identificar se um {@link SiseducaException}
	 * contém outro {@link SiseducaException} encapsulado.
	 * 
	 * @author Paulo Neto - pasvsi@gmail.com
	 * 
	 * @param throwable
	 *            A exceção a ser analisada.
	 * @return Uma exceção de negócio ou null caso a exceção passada como
	 *         parâmetro não contenha uma instância de {@link SiseducaException}.
	 */
	public static final SiseducaException getUltimoPMJPException(Throwable throwable) {

		SiseducaException retorno = null;

		if (throwable != null && throwable instanceof SiseducaException) {
			retorno = (SiseducaException) throwable;
			if (throwable.getCause() != null
					&& throwable.getCause() instanceof SiseducaException) {
				retorno = getUltimoPMJPException(throwable.getCause());
			}
		}
		return retorno;
	}

}
