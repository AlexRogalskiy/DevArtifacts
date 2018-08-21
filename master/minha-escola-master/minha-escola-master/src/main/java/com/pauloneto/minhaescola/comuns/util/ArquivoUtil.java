package com.pauloneto.minhaescola.comuns.util;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

import com.pauloneto.minhaescola.comuns.util.excecao.CoreValidacoes;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

@Component
public class ArquivoUtil {

	public static final String SEPARADOR_PONTO_VIRGULA = ";";
	public static final String EXTENSAO_XLS = ".xls";
	public static final String EXTENSAO_PDF = ".pdf";

	/**
	 * Cria um arquivo novo com os dados informados.
	 * 
	 * @param path
	 *            O caminho, incluindo o nome do arquivo.
	 * @param dados
	 *            Os dados que serao gravados no arquivo.
	 * @throws PMJPException
	 *             Caso ocorra alguma exceção ao criar o arquivo ou ao gravar os
	 *             dados no mesmo.
	 */
	public void criar(String path, byte[] dados)
			throws SiseducaException {

		File arquivo = criar(path, true);

		try {

			salvar(arquivo, dados);

		} catch (SecurityException e) {
			throw new SiseducaException(CoreValidacoes.ERRO_INESPERADO, e);
		}
	}

	/**
	 * Salva os bytes informados no arquivo passado.
	 * 
	 * @param arquivo
	 *            O arquivo onde sera gravado os bytes
	 * @param dados
	 *            Os dados que devem ser gravados.
	 * @throws PMJPException
	 *             Caso ocorra alguma exceção ao gravar os dados.
	 */
	public void salvar(File arquivo, byte[] dados)
			throws SiseducaException {

		try {

			OutputStream os = new FileOutputStream(arquivo);
			os.write(dados);
			os.flush();
			os.close();

		} catch (SecurityException e) {
			throw new SiseducaException(CoreValidacoes.ERRO_INESPERADO, e);
		} catch (Exception e) {
			throw new SiseducaException(CoreValidacoes.ERRO_INESPERADO, e);
		}

	}

	/**
	 * Cria um arquivo novo a partir do path informado.
	 * 
	 * @param path
	 *            o path informado
	 * @param sobrescreve
	 *            um boolean indicando sobrescrita de arquivo
	 * @return um arquivo novo a partir do path informado
	 * @throws PMJPException
	 *             caso o arquivo já exista ou caso ocorra algum problema na
	 *             criação do mesmo
	 */
	private static File criar(String path, boolean sobrescreve)
			throws SiseducaException {

		File arquivo = null;

		try {

			arquivo = new File(path);
			boolean ehNovo = arquivo.createNewFile();

			if (!ehNovo && !sobrescreve) {
				throw new SiseducaException(CoreValidacoes.ERRO_INESPERADO);
			}

		} catch (Exception e) {
			throw new SiseducaException(CoreValidacoes.ERRO_INESPERADO, e);
		}

		return arquivo;
	}
	
	/**
     * @author Paulo Neto - pasvsi@gmail.com
     * 
     * Executar download de arquivo a partir de array de bytes
     * 
     * @param bytes
     * @param nomeExibicao
     * @throws SiseducaException
     */
	public synchronized void downloadFromByteArray(byte[] bytes,
			String nomeExibicao) throws SiseducaException {
		try {
			HttpServletResponse response = (HttpServletResponse) FacesContext
					.getCurrentInstance().getExternalContext().getResponse();
			response.setContentType("application/x-msdownload");
			response.setHeader("Expires", "0");
			response.setHeader("Cache-Control",
					"must-revalidate, post-check=0, pre-check=0");
			response.setHeader("Content-Disposition", "inline; filename="
					+ nomeExibicao);
			OutputStream output = response.getOutputStream();
			output.write(bytes);
			response.flushBuffer();
			FacesContext.getCurrentInstance().responseComplete();
		} catch (FileNotFoundException e) {
			throw new SiseducaException(CoreValidacoes.ERRO_CARREGAR_ARQUIVO, e);
		} catch (IOException e) {
			throw new SiseducaException(CoreValidacoes.ERRO_CARREGAR_ARQUIVO, e);
		}
	}
}
