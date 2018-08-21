package com.pauloneto.minhaescola.persistencia.dao.implementacoes;

import java.util.List;

import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.pauloneto.minhaescola.comuns.modelo.Arquivo;
import com.pauloneto.minhaescola.comuns.modelo.TipoArquivo;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

@Repository
public class ArquivoDao extends GenericDAOImplement<Arquivo> {

	@Override
	public List<Arquivo> pesquisarTodos() throws SiseducaException {
		StringBuilder consulta = new StringBuilder("select a from Arquivo a");
		Query query = getEntityManager().createQuery(consulta.toString());
		return query.getResultList();
	}

	public TipoArquivo obterTipoArquivoPorId(Integer idTipoArquivo) {
		StringBuilder consulta = new StringBuilder("select a from TipoArquivo a where a.idTipoArquivo = :id");
		TypedQuery<TipoArquivo> query = getEntityManager().createQuery(consulta.toString(), TipoArquivo.class);
		query.setParameter("id", idTipoArquivo);
		return query.getSingleResult();
	}

	
}
