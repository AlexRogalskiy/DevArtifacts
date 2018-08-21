package com.pauloneto.minhaescola.persistencia.dao.implementacoes;

import java.util.List;

import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.pauloneto.minhaescola.comuns.modelo.Usuario;
import com.pauloneto.minhaescola.comuns.util.excecao.CoreValidacoes;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

@Repository
public class UsuarioDAO extends GenericDAOImplement<Usuario> {
	
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Usuario> pesquisarTodos() throws SiseducaException {
		String select = "select usu from Usuario usu";
		Query consulta = getEntityManager().createQuery(select);
		return consulta.getResultList();
	}

	public Usuario pesquisarPorLogin(String login) throws SiseducaException{
		StringBuilder select = new StringBuilder("select usu from Usuario usu ");
		select.append("where usu.login = :login");
		Usuario retorno;
		try{
			TypedQuery<Usuario> consulta = getEntityManager().createQuery(select.toString(),Usuario.class);
			consulta.setParameter("login", login);
			retorno = consulta.getSingleResult();
			return retorno;
		}catch(Exception e){
			throw  new SiseducaException(CoreValidacoes.ERRO_CONSULT_USUARIO_LOGIN,e);
		}
	}
	
}
