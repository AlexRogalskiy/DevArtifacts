package com.pauloneto.minhaescola.persistencia.dao.implementacoes;

import java.util.List;

import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import com.pauloneto.minhaescola.comuns.modelo.Menu;
import com.pauloneto.minhaescola.comuns.modelo.Usuario;
import com.pauloneto.minhaescola.comuns.util.excecao.CoreValidacoes;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

@Repository
public class MenuDAO extends GenericDAOImplement<Menu> {
	
	
	@Override
	public List<Menu> pesquisarTodos() throws SiseducaException {
		StringBuilder select = new StringBuilder("select menu from Menu menu ");
		List<Menu> retorno;
		try{
			TypedQuery<Menu> consulta = getEntityManager().createQuery(select.toString(), Menu.class); 
			retorno = consulta.getResultList();
			return retorno;
		}catch(Exception e){
			throw new SiseducaException(CoreValidacoes.ERRO_NAO_ENCONTROU_NENHUM_MENU,e);
		}
	}
	
	public Menu pesquisarPorUsuario(Usuario usuario) throws SiseducaException{
		StringBuilder select = new StringBuilder("select menu from Menu menu ");
		select.append("where menu.idMenu = :idMenuUsuario");
		Menu retorno;
		try{
			TypedQuery<Menu> consulta = getEntityManager().createQuery(select.toString(), Menu.class);
			consulta.setParameter("idMenuUsuario", usuario.getMenu().getIdMenu());
			retorno = consulta.getSingleResult();
			return retorno;
		}catch(Exception e){
			throw new SiseducaException(CoreValidacoes.ERRO_NAO_ENCONTROU_MENU_USUARIO,e);
		}
	}

}
