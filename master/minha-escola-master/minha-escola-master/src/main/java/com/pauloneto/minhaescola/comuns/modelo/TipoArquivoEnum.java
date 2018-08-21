package com.pauloneto.minhaescola.comuns.modelo;

public enum TipoArquivoEnum {

	ARQUIVO_TESTE(new TipoArquivo(1,"teste")),
	ARQUIVO_FOTO_ALUNO(new TipoArquivo(2,"Foto Aluno"));
	
	private TipoArquivo tipoArquivo;

	private TipoArquivoEnum(TipoArquivo tpArquivo){
		this.tipoArquivo = tpArquivo;
	}
	
	/**
	 * @return the tipoArquivo
	 */
	public TipoArquivo getTipoArquivo() {
		return tipoArquivo;
	}
	
}
