package com.pauloneto.minhaescola.negocio.interfaces;

import com.pauloneto.minhaescola.comuns.modelo.Usuario;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

public interface IUsuarioService {
	
	public void salvar(Usuario entidade)throws SiseducaException;
	public void atualizar(Usuario entidade)throws SiseducaException;
	public void remover(Usuario entidade)throws SiseducaException;
	public Usuario pesquisarPorId(Class<Usuario> clazz,Integer idEntidade)throws SiseducaException;
	public Usuario pesquisarPorLogin(String login)throws SiseducaException;
}
