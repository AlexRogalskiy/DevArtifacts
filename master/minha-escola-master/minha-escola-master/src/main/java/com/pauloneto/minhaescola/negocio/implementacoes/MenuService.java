package com.pauloneto.minhaescola.negocio.implementacoes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pauloneto.minhaescola.comuns.modelo.Menu;
import com.pauloneto.minhaescola.comuns.modelo.Usuario;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.negocio.interfaces.IMenuService;
import com.pauloneto.minhaescola.persistencia.dao.implementacoes.MenuDAO;

@Transactional
@Service
public class MenuService implements IMenuService {

	@Autowired
	private MenuDAO menuDao;
	
	@Override
	public Menu consultarPorUsuario(Usuario usuario) throws SiseducaException {
		return menuDao.pesquisarPorUsuario(usuario);
	}

	@Override
	public void salvar(Menu entidade) throws SiseducaException {
		menuDao.salvar(entidade);
	}

	@Override
	public void atualizar(Menu entidade) throws SiseducaException {
		menuDao.atualizar(entidade);
	}

	@Override
	public void remover(Menu entidade) throws SiseducaException {
		menuDao.remover(entidade);
	}

	@Override
	public Menu pesquisarPorId(Class<Menu> clazz, Integer idEntidade)
			throws SiseducaException {
		Menu retorno = menuDao.pesquisarPorId(clazz, idEntidade);
		return retorno;
	}
}
