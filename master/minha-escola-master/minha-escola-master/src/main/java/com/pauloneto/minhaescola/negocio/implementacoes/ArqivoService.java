package com.pauloneto.minhaescola.negocio.implementacoes;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pauloneto.minhaescola.comuns.modelo.Arquivo;
import com.pauloneto.minhaescola.comuns.modelo.TipoArquivo;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.negocio.interfaces.IArquivoService;
import com.pauloneto.minhaescola.persistencia.dao.implementacoes.ArquivoDao;

@Service
@Transactional
public class ArqivoService implements IArquivoService {

	@Autowired
	private ArquivoDao arquivoDao;
	
	@Override
	@Transactional
	public void salvarArquivo(Arquivo arquivo) throws SiseducaException {
		arquivoDao.salvar(arquivo);
	}

	@Override
	public TipoArquivo carregarTipoArquivoPorId(Integer idTipoArquivo) {
		return arquivoDao.obterTipoArquivoPorId(idTipoArquivo);
	}

	@Override
	public List<Arquivo> obterTodos() throws SiseducaException{
		return arquivoDao.pesquisarTodos();
	}
}
