package com.pauloneto.minhaescola.negocio.implementacoes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pauloneto.minhaescola.comuns.modelo.Usuario;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.negocio.interfaces.IUsuarioService;
import com.pauloneto.minhaescola.persistencia.dao.implementacoes.UsuarioDAO;

@Transactional
@Service
public class UsuarioService implements IUsuarioService {

	@Autowired
	private UsuarioDAO usuarioDAO;
	
	@Override
	public void salvar(Usuario entidade) throws SiseducaException {
		usuarioDAO.salvar(entidade);
	}

	@Override
	public void atualizar(Usuario entidade) throws SiseducaException {
		usuarioDAO.atualizar(entidade);

	}

	@Override
	public void remover(Usuario entidade) throws SiseducaException {
		usuarioDAO.remover(entidade);

	}

	@Override
	public Usuario pesquisarPorId(Class<Usuario> clazz, Integer idEntidade)
			throws SiseducaException {
		Usuario usuario = usuarioDAO.pesquisarPorId(clazz, idEntidade);
		return usuario;
	}

	@Override
	public Usuario pesquisarPorLogin(String login) throws SiseducaException {
		return usuarioDAO.pesquisarPorLogin(login);
	}
}
