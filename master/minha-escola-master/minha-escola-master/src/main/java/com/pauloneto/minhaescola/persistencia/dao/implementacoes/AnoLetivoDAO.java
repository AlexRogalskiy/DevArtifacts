package com.pauloneto.minhaescola.persistencia.dao.implementacoes;

import java.util.List;

import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import com.pauloneto.minhaescola.comuns.modelo.AnoLetivo;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

@Repository
public class AnoLetivoDAO extends GenericDAOImplement<AnoLetivo> {
	

	@SuppressWarnings("unchecked")
	@Override
	public List<AnoLetivo> pesquisarTodos() throws SiseducaException {
		String select = "select al from AnoLetivo al";
		Query consulta = getEntityManager().createQuery(select);
		return consulta.getResultList();
	}

}
