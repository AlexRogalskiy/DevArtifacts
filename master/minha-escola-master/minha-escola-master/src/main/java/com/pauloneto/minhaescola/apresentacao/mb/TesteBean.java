package com.pauloneto.minhaescola.apresentacao.mb;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.faces.context.FacesContext;
import javax.servlet.ServletContext;

import org.primefaces.context.RequestContext;
import org.primefaces.event.FileUploadEvent;
import org.primefaces.model.UploadedFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.pauloneto.minhaescola.comuns.modelo.Arquivo;
import com.pauloneto.minhaescola.comuns.modelo.TipoArquivo;
import com.pauloneto.minhaescola.comuns.modelo.TipoArquivoEnum;
import com.pauloneto.minhaescola.comuns.util.ArquivoUtil;
import com.pauloneto.minhaescola.comuns.util.GeradorGrafico;
import com.pauloneto.minhaescola.comuns.util.RelatorioPdfUtil;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.comuns.util.grafico.GraficoArquivoVo;
import com.pauloneto.minhaescola.negocio.interfaces.IArquivoService;

@Controller(value="testeBean")
@Scope("view")
public class TesteBean implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7523263901955093848L;

	@Autowired
	private IArquivoService arquivoService;
	
	@Autowired
	private RelatorioPdfUtil relatorioPdfUtil;
	
	@Autowired
	private ArquivoUtil arquivoUtil;
	
	@Autowired
	private GeradorGrafico geradorGrafico;
	
	private UploadedFile file;
	private Arquivo arquivo;
	private byte[] pdf;
	private String nomePdf = "testeImagemBd.pdf";
	private String caminhoPastaRelatorio = "/resources/relatorios/";
	private boolean renderizarpdfDlg;
	
	@PostConstruct
	public void init(){
		nomePdf = "testeImagemBd.pdf";
	}
	
	public void handleFileUpload(FileUploadEvent event){
		this.file = event.getFile();
	}
	
	public String salvarArquivo() throws SiseducaException{
		if(file != null){
			arquivo = new Arquivo();
			TipoArquivo tipoArquivo = arquivoService.carregarTipoArquivoPorId(TipoArquivoEnum.ARQUIVO_TESTE.getTipoArquivo().getIdTipoArquivo());
			arquivo.setTipoArquivo(tipoArquivo);
			arquivo.setArquivoBinario(file.getContents());
			arquivo.setNomeArquivo(file.getFileName());
			arquivoService.salvarArquivo(arquivo);
			List<Arquivo> dados = new ArrayList<Arquivo>();
			dados.add(arquivo);
			Map<String,Object> parametros = new HashMap<String, Object>();
			parametros.put("ARQUIVO_BINARIO", new ByteArrayInputStream(arquivo.getArquivoBinario()));
			parametros.put("NOME_ARQUIVO",arquivo.getNomeArquivo());
			pdf = relatorioPdfUtil.getBytesRelatorio("testeImagemBd.jrxml", parametros, dados);
			String caminho = obterCaminhoRelatorio(caminhoPastaRelatorio, "");
			arquivoUtil.criar(caminho+"/"+nomePdf, pdf);
			setRenderizarpdfDlg(true);
			file = null;
			return "visualizarPdf.xhtml?faces-redirect=true";
		}else{
			file = null;
			return null;
		}
	}
	
	@SuppressWarnings("static-access")
	public void gerarGrafico() throws Exception{
		List<Arquivo> retorno = arquivoService.obterTodos();
		Map<String,Object> parametros = new HashMap<String, Object>();
		gerarGrafico(parametros,retorno);
		byte[] bytes = relatorioPdfUtil.getBytesRelatorio("testeRelatorioGrafico.jrxml", parametros, retorno);
		arquivoUtil.downloadFromByteArray(bytes, "testeRelatorioGrafico.pdf");
	}
	
	private void gerarGrafico(Map<String, Object> parametros,
			List<Arquivo> retorno) throws Exception {
		int quantidadeTeste = 0;
		int quantidadeFotoAluno = 0;
		GraficoArquivoVo teste = new GraficoArquivoVo();
		GraficoArquivoVo fotoAlono = new GraficoArquivoVo();
		for(Arquivo arq:retorno){
			if(new Integer(1).equals(arq.getTipoArquivo().getIdTipoArquivo())){
				quantidadeTeste++;
				teste.setTipoArquivo(arq.getTipoArquivo().getDescricao());
			}
			if(new Integer(2).equals(arq.getTipoArquivo().getIdTipoArquivo())){
				quantidadeFotoAluno++;
				fotoAlono.setTipoArquivo(arq.getTipoArquivo().getDescricao());
			}
		}
		teste.setQuantidade(quantidadeTeste);
		fotoAlono.setQuantidade(quantidadeFotoAluno);
		ArrayList<GraficoArquivoVo> valores = new ArrayList<GraficoArquivoVo>();
		valores.add(teste);
		valores.add(fotoAlono);
		BufferedImage grafico = geradorGrafico.gerarGraficoPizza3D("GRAFICO ARQUIVO", "ARQUIVO", "QUANTIDADE", valores);
		parametros.put("IMAGEM_GRAFICO",grafico);
	}

	public String voltar(){
		return "testeGerarArquivoBD.xhtml?faces-redirect=true";
	}
	
	private String obterCaminhoRelatorio(String pastaRelatorios,
			String nomeRelatorio) {
		
		FacesContext facesContext = FacesContext.getCurrentInstance();
		facesContext.responseComplete();
		ServletContext scontext = (ServletContext) facesContext
			.getExternalContext().getContext();
		return scontext.getRealPath(pastaRelatorios+nomeRelatorio);
	}
	
	public void abrirDialog(String widgetVar){
		RequestContext.getCurrentInstance().execute(widgetVar+".show();");
	}

	public void fecharDialog(String widgetVar){
		RequestContext.getCurrentInstance().execute(widgetVar+".hide();");
	}
	
	public void executeUpdate(String idComponente){
		RequestContext.getCurrentInstance().update(idComponente);
	}
	
	/**
	 * @return the file
	 */
	public UploadedFile getFile() {
		return file;
	}

	/**
	 * @param file the file to set
	 */
	public void setFile(UploadedFile file) {
		this.file = file;
	}

	/**
	 * @return the arquivo
	 */
	public Arquivo getArquivo() {
		return arquivo;
	}

	/**
	 * @param arquivo the arquivo to set
	 */
	public void setArquivo(Arquivo arquivo) {
		this.arquivo = arquivo;
	}

	/**
	 * @return the pdf
	 */
	public byte[] getPdf() {
		return pdf;
	}

	/**
	 * @param pdf the pdf to set
	 */
	public void setPdf(byte[] pdf) {
		this.pdf = pdf;
	}

	/**
	 * @return the nomePdf
	 */
	public String getNomePdf() {
		return nomePdf;
	}

	/**
	 * @param nomePdf the nomePdf to set
	 */
	public void setNomePdf(String nomePdf) {
		this.nomePdf = nomePdf;
	}

	/**
	 * @return the renderizarpdfDlg
	 */
	public boolean isRenderizarpdfDlg() {
		return renderizarpdfDlg;
	}

	/**
	 * @param renderizarpdfDlg the renderizarpdfDlg to set
	 */
	public void setRenderizarpdfDlg(boolean renderizarpdfDlg) {
		this.renderizarpdfDlg = renderizarpdfDlg;
	}
}
