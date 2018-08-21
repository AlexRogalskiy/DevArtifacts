package com.pauloneto.minhaescola.comuns.util.excecao;

import java.util.ResourceBundle;

import com.pauloneto.minhaescola.comuns.util.MenssagesProperties;


public enum CoreValidacoes implements SISEDUCAValidacoes {
	ERRO_SALVAR_ENTIDADE("MS005",null,SEVERIDADE_ERRO),
	ERRO_ATUALIZAR_ENTIDADE("MS006",null,SEVERIDADE_ERRO),
	ERRO_REMOVER_ENTIDADE("MS007",null,SEVERIDADE_ERRO),
	ERRO_CONSULTAR_POR_ID("MS008",null,SEVERIDADE_ERRO), 
	ALERTA_DATA_INVALIDA("MS009",null,SEVERIDADE_ERRO),
	ERRO_CONSULT_USUARIO_LOGIN("MS013",null,SEVERIDADE_ERRO), 
	ERRO_NAO_ENCONTROU_MENU_USUARIO("MS014",null,SEVERIDADE_ERRO), 
	ERRO_NAO_ENCONTROU_NENHUM_MENU("MS015",null,SEVERIDADE_ERRO),
	ERRO_GERAR_RELATORIO("",null,SEVERIDADE_ERRO), 
	ERRO_INESPERADO("",null,SEVERIDADE_ERRO), 
	ERRO_CARREGAR_ARQUIVO("",null,SEVERIDADE_ERRO);

	public static final ResourceBundle RESOURCE_BUNDLE = ResourceBundle
			.getBundle("/messages_pt_BR");

	private String codigoMsg;
	private String codigoMsgAuxiliar;
	private int severidade = SEVERIDADE_ERRO;

	private CoreValidacoes(String codigoMsg, String codigoMsgAuxiliar) {
		this.codigoMsg = codigoMsg;
		this.codigoMsgAuxiliar = codigoMsgAuxiliar;
	}

	private CoreValidacoes(String codigoMsg, String codigoMsgAuxiliar,
			int severidade) {
		this.codigoMsg = codigoMsg;
		this.codigoMsgAuxiliar = codigoMsgAuxiliar;
		this.severidade = severidade;
	}

	public static CoreValidacoes carregarPorCodigoMsg(String codigo) {
		for (CoreValidacoes co : CoreValidacoes.values()) {
			if (codigo.equals(co.getCodigoMsg())) {
				return co;
			}
		}
		return null;
	}

	@Override
	public String getCodigoMsg() {
		return this.codigoMsg;
	}

	@Override
	public String getCodigoMsgAuxiliar() {
		return this.codigoMsgAuxiliar;
	}

	@Override
	public int getSeveridade() {
		return this.severidade;
	}

	@Override
	public String getDescricaoMsg() {
		return MenssagesProperties.getMessage(RESOURCE_BUNDLE, this.getCodigoMsg());
	}

	@Override
	public String getDescricaoMsgAuxiliar() {
		return MenssagesProperties.getMessage(RESOURCE_BUNDLE,
				this.getCodigoMsgAuxiliar());
	}
}
