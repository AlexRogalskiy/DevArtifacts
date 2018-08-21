package com.pauloneto.minhaescola.comuns.util.excecao;

public interface SISEDUCAValidacoes {

	public static final int SEVERIDADE_ERRO = 1;

    public static final int SEVERIDADE_ALERTA = 2;

    public String getCodigoMsg();

    public String getCodigoMsgAuxiliar();

    public int getSeveridade();
    
    public String getDescricaoMsg();   

    public String getDescricaoMsgAuxiliar();
}
