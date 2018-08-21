package com.pauloneto.minhaescola.comuns.util;

import java.text.MessageFormat;
import java.util.Iterator;
import java.util.ResourceBundle;

import javax.faces.application.FacesMessage;
import javax.faces.application.FacesMessage.Severity;
import javax.faces.context.FacesContext;
import javax.faces.convert.ConverterException;
import javax.faces.validator.ValidatorException;

public class MenssagesProperties {

	/**
	 * Nome do arquivo de properties.
	 */
	private static final ResourceBundle DEFAULT_RESOURCE_BUNDLE = ResourceBundle
			.getBundle("/messages_pt_BR");

	private MenssagesProperties() {
		super();
	}

	/**
	 * Recupera uma mensagem do arquivo de properties.
	 * 
	 * @param key
	 *            A chave da propriedade.
	 * @return O valor da propriedade.
	 */
	public static String getMessage(String key) {
		return getMessage(DEFAULT_RESOURCE_BUNDLE, key);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * 
	 *         Método que retorna a descrição de uma mensagem informada no
	 *         arquivo .properties
	 * @param bundle
	 * @param codMsg
	 * @param params
	 * @return String
	 */
	public static String getMessage(ResourceBundle bnd, String codMsg,
			String... params) {
		String retorno = null;
		if (bnd != null) {
			boolean existeMsg = bnd.containsKey(codMsg);
			while (existeMsg) {
				retorno = bnd.getString(codMsg.toString());
				if (StringUtil.valorPreenchido(retorno)) {
					if (retorno.startsWith("${")
							&& retorno.trim().endsWith("}")) {
						codMsg = retorno.replaceFirst("\\$", "")
								.replaceFirst("\\{", "")
								.replaceFirst("\\}", "").trim();
						existeMsg = bnd.containsKey(codMsg);
					} else {
						existeMsg = false;
					}
				} else {
					existeMsg = false;
				}
			}
		}
		return getTextMessageReplace(retorno, params);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * 
	 *         Método que sobrescreve os valores dos parametros, na descrição de
	 *         uma mensagem
	 * @param descMsg
	 * @param params
	 * @return String
	 */
	public static String getTextMessageReplace(String descMsg, String... params) {
		if (descMsg != null && params != null) {
			MessageFormat mf = new MessageFormat(descMsg);
			descMsg = mf.format(params, new StringBuffer(), null).toString();
		}
		return descMsg;
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * 
	 * Método que sobrescreve os valores dos parametros, na descrição de uma
	 * mensagem obtida através do arquivo .properties pelo código da mensagem
	 * 
	 * @param codMsg
	 * @param values
	 * @return String
	 */
	public static String getMessageReplace(String codMsg, String... params) {
		String line = DEFAULT_RESOURCE_BUNDLE.getString(codMsg);
		return getTextMessageReplace(line, params);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * Metodo para exibir uma mensagem de erro na tela.
	 * 
	 * @param codMsg
	 */
	public static void errorMsg(String codMsg) {
		exibeMsg(FacesMessage.SEVERITY_ERROR, codMsg, null);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * Metodo para exibir uma mensagem de sucesso na tela.
	 * 
	 * @param codMsg
	 */
	public static void sucessoMsg(String codMsg) {
		exibeMsg(FacesMessage.SEVERITY_INFO, codMsg, null);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * Metodo para exibir uma mensagem de alerta na tela.
	 * 
	 * @param codMsg
	 */
	public static void warningMsg(String codMsg) {
		exibeMsg(FacesMessage.SEVERITY_WARN, codMsg, null);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * Metodo para exibir uma mensagem de alerta na tela.
	 * 
	 * @param codMsg
	 */
	public static void fatalMsg(String codMsg) {
		exibeMsg(FacesMessage.SEVERITY_FATAL, codMsg, null);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * Metodo para limpar todas as mensagens.
	 */
	public static void cleanMessages() {
		Iterator<String> itIds = FacesContext.getCurrentInstance()
				.getClientIdsWithMessages();
		while (itIds.hasNext()) {
			itIds.next();
			itIds.remove();
		}
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * 
	 *         Método responsável por exibir mensagens em páginas JSF
	 * @param severity
	 * @param codMsg
	 * @param codMsgDetalhe
	 * @param params
	 */
	public static void exibeMsg(Severity severity, String codMsg,
			String codMsgDetalhe, String... params) {
		FacesMessage fm = getFacesMessage(severity, codMsg, codMsgDetalhe,
				params);
		FacesContext fc = FacesContext.getCurrentInstance();
		fc.addMessage(null, fm);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * 
	 *         Metodo para exibir uma mensagem de validação ao lado do
	 *         componete. usando o atributo "validate"
	 * 
	 * @param severity
	 * @param codMsg
	 * @param codMsgDetalhe
	 * @param params
	 * @throws ValidatorException
	 */
	public static void exibeMsgValidatorException(Severity severity,
			String codMsg, String codMsgDetalhe, String... params)
			throws ValidatorException {
		FacesMessage fm = getFacesMessage(severity, codMsg, codMsgDetalhe,
				params);
		throw new ValidatorException(fm);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * 
	 *         Metodo para exibir uma mensagem de conversao ao lado do
	 *         componete. usando o atributo "converter"
	 * 
	 * @param severity
	 * @param codMsg
	 * @param codMsgDetalhe
	 * @param params
	 * @throws ConverterException
	 */
	public static void exibeMsgConverterException(Severity severity,
			String codMsg, String codMsgDetalhe, String... params)
			throws ConverterException {
		FacesMessage fm = getFacesMessage(severity, codMsg, codMsgDetalhe,
				params);
		throw new ConverterException(fm);
	}

	/**
	 * @author Paulo Neto - pasvsi@gmail.com
	 * 
	 *         Criar mensagem JSF (FacesMessage) obtendo o conteudo do arquivo
	 *         .properties
	 * @param severity
	 * @param codMsg
	 * @param codMsgDetalhe
	 * @param params
	 * @return FacesMessage
	 */
	private static FacesMessage getFacesMessage(Severity severity,
			String codMsg, String codMsgDetalhe, String... params) {
		String textoMsg = getMessage(DEFAULT_RESOURCE_BUNDLE, codMsg, params);
		if (codMsgDetalhe != null && !codMsgDetalhe.isEmpty()) {
			codMsgDetalhe = getMessage(DEFAULT_RESOURCE_BUNDLE, codMsgDetalhe);
		} else {
			codMsgDetalhe = "";
		}
		FacesMessage fm = new FacesMessage(severity, textoMsg, codMsgDetalhe);
		return fm;
	}
}
