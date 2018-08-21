package com.pauloneto.minhaescola.negocio.interfaces;

import java.util.List;

import com.pauloneto.minhaescola.comuns.modelo.Arquivo;
import com.pauloneto.minhaescola.comuns.modelo.TipoArquivo;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

public interface IArquivoService {

	public void salvarArquivo(Arquivo arquivo) throws SiseducaException;

	public TipoArquivo carregarTipoArquivoPorId(Integer idTipoArquivo);

	public List<Arquivo> obterTodos() throws SiseducaException;
}
