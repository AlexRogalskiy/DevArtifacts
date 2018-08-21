package com.pauloneto.minhaescola.negocio.interfaces;

import com.pauloneto.minhaescola.comuns.modelo.Menu;
import com.pauloneto.minhaescola.comuns.modelo.Usuario;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

public interface IMenuService {

	public void salvar(Menu entidade)throws SiseducaException;
	public void atualizar(Menu entidade)throws SiseducaException;
	public void remover(Menu entidade)throws SiseducaException;
	public Menu pesquisarPorId(Class<Menu> clazz,Integer idEntidade)throws SiseducaException;
	public Menu consultarPorUsuario(Usuario usuario)throws SiseducaException;
	
}
