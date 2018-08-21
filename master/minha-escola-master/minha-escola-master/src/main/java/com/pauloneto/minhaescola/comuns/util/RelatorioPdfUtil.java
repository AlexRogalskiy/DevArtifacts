package com.pauloneto.minhaescola.comuns.util;


import java.util.List;
import java.util.Map;

import javax.faces.context.FacesContext;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

import org.springframework.stereotype.Component;

import com.pauloneto.minhaescola.comuns.util.excecao.CoreValidacoes;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

@Component
public class RelatorioPdfUtil {

	private static final String VISUALIZAR = "inline";
	private static final String DOWNLOAD = "attachment";
	private String caminhoRelatorios;
	private String pastaRelatorios = "/resources/relatorios/";

	public void visualizar(String nomeRelatorio,Map<String, Object> parametros,
			List<?> dados) throws SiseducaException{
		JasperPrint jasperPrint = compilar(parametros, dados, nomeRelatorio);
		montarResponse(VISUALIZAR,nomeRelatorio,getByteArray(jasperPrint));
	}

	public void download(String nomeRelatorio, Map<String, Object> parametros,
			List<?> dados) throws SiseducaException{
		JasperPrint jasperPrint = compilar(parametros, dados, nomeRelatorio);
		montarResponse(DOWNLOAD,nomeRelatorio,getByteArray(jasperPrint));
	}
	
	public byte[] getBytesRelatorio(String nomeRelatorio, Map<String, Object> parametros,
			List<?> dados) throws SiseducaException{
		JasperPrint jasperPrint = compilar(parametros, dados, nomeRelatorio);
		return getByteArray(jasperPrint);
	}

	private void montarResponse(String tipoGeracao, String nomeRelatorio, byte[] bytes) throws SiseducaException {
		try {
			FacesContext context = FacesContext.getCurrentInstance();
			HttpServletResponse response = (HttpServletResponse) context
					.getExternalContext().getResponse();
			response.reset();
			response.addHeader("Content-disposition", tipoGeracao
					+ ";filename=" + nomeRelatorio + ".pdf");

			response.setContentLength(bytes.length);
			response.getOutputStream().write(bytes);
			response.setContentType("application/pdf");
			context.responseComplete();

		} catch (Exception e) {
			throw new SiseducaException(CoreValidacoes.ERRO_GERAR_RELATORIO, e);
		}
	}

	private JasperPrint compilar(Map<String, Object> parametros,
			List<?> dados, String nomeRelatorio) throws SiseducaException{
		try {
			this.caminhoRelatorios = obterCaminhoRelatorio(pastaRelatorios,nomeRelatorio);
			JasperReport report = JasperCompileManager
					.compileReport(caminhoRelatorios);
			return JasperFillManager.fillReport(report, parametros,
					new JRBeanCollectionDataSource(dados));
		} catch (JRException e) {
			throw new SiseducaException(CoreValidacoes.ERRO_GERAR_RELATORIO,e);
		}
	}

	private String obterCaminhoRelatorio(String pastaRelatorios,
			String nomeRelatorio) {
		FacesContext facesContext = FacesContext.getCurrentInstance();
		facesContext.responseComplete();
		ServletContext scontext = (ServletContext) facesContext
			.getExternalContext().getContext();
		return scontext.getRealPath(pastaRelatorios+nomeRelatorio);
	}

	private byte[] getByteArray(JasperPrint jasperPrint) throws SiseducaException {

		try {
			return JasperExportManager.exportReportToPdf(jasperPrint);
		} catch (JRException e) {
			throw new SiseducaException(CoreValidacoes.ERRO_GERAR_RELATORIO, e);

		}
	}
	
}
