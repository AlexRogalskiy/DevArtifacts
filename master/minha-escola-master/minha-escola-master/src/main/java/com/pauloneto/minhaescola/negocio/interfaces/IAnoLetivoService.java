package com.pauloneto.minhaescola.negocio.interfaces;

import com.pauloneto.minhaescola.comuns.modelo.AnoLetivo;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

public interface IAnoLetivoService {

	public void salvar(AnoLetivo entidade)throws SiseducaException;
	public void atualizar(AnoLetivo entidade)throws SiseducaException;
	public void remover(AnoLetivo entidade)throws SiseducaException;
	public AnoLetivo pesquisarPorId(Class<AnoLetivo> clazz,Integer idEntidade)throws SiseducaException;
}



