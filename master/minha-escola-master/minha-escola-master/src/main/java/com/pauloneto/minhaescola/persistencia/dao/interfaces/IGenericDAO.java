package com.pauloneto.minhaescola.persistencia.dao.interfaces;

import java.util.List;

import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;

public interface IGenericDAO<T> {
	
	public void salvar(T entidade) throws SiseducaException;
	public void atualizar(T entidade) throws SiseducaException;
	public void remover(T entidade) throws SiseducaException;
	public T pesquisarPorId(Class<T> clazz,Integer idEntidade) throws SiseducaException;
	public List<T> pesquisarTodos() throws SiseducaException;
}
