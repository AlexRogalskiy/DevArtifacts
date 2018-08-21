package com.pauloneto.minhaescola.persistencia.dao.implementacoes;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Session;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.pauloneto.minhaescola.comuns.util.excecao.CoreValidacoes;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.persistencia.dao.interfaces.IGenericDAO;

public abstract class GenericDAOImplement<T> implements IGenericDAO<T> {

	@PersistenceContext
	private EntityManager entityManager;
	
	@Override
	public void salvar(T entidade) throws SiseducaException {
		try{
			getEntityManager().persist(entidade);
		}catch(Exception ex){
			throw new SiseducaException(CoreValidacoes.ERRO_SALVAR_ENTIDADE,ex);
		}
	}

	@Override
	public void atualizar(T entidade) throws SiseducaException {
		try{
			getEntityManager().merge(entidade);
		}catch(Exception ex){
			throw new SiseducaException(CoreValidacoes.ERRO_ATUALIZAR_ENTIDADE,ex);
		}
	}

	@Override
	public void remover(T entidade) throws SiseducaException {
		try{
			getEntityManager().remove(entidade);
		}catch(Exception ex){
			throw new SiseducaException(CoreValidacoes.ERRO_REMOVER_ENTIDADE,ex);
		}
	}
	
	@Override
	public T pesquisarPorId(Class<T> clazz,Integer idEntidade) throws SiseducaException {
		try{
			T entidade = getEntityManager().find(clazz, idEntidade);
			return entidade;
		}catch(Exception ex){
			throw new SiseducaException(CoreValidacoes.ERRO_CONSULTAR_POR_ID,ex);
		}
	}

	/**
	 * @return the entityManager
	 */
	public EntityManager getEntityManager() {
		return entityManager;
	}
	
	/**
	 * @return the Session of Hibernate
	 */
	public Session getHibernateSession(){
		return getEntityManager().unwrap(Session.class);
	}
}
