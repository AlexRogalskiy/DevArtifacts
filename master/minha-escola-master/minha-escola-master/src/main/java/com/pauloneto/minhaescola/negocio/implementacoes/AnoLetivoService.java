package com.pauloneto.minhaescola.negocio.implementacoes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pauloneto.minhaescola.comuns.modelo.AnoLetivo;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.negocio.interfaces.IAnoLetivoService;
import com.pauloneto.minhaescola.persistencia.dao.implementacoes.AnoLetivoDAO;

@Transactional
@Service
public class AnoLetivoService implements IAnoLetivoService {

	@Autowired
	private AnoLetivoDAO anoLetivoDAO;
	
	@Override
	public void salvar(AnoLetivo entidade) throws SiseducaException {
		anoLetivoDAO.salvar(entidade);
	}

	@Override
	public void atualizar(AnoLetivo entidade) throws SiseducaException {
		anoLetivoDAO.atualizar(entidade);
	}

	@Override
	public void remover(AnoLetivo entidade) throws SiseducaException {
		anoLetivoDAO.remover(entidade);
	}

	@Override
	public AnoLetivo pesquisarPorId(Class<AnoLetivo> clazz,Integer idEntidade)
			throws SiseducaException {
		AnoLetivo retorno =  anoLetivoDAO.pesquisarPorId(clazz, idEntidade);
		return retorno;
	}
}
