package com.pauloneto.minhaescola.test.servico;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.DigestUtils;

import com.pauloneto.minhaescola.comuns.modelo.Usuario;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.negocio.interfaces.IUsuarioService;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext-test.xml")
public class UsuarioServicoTest { 

	@Autowired
	private IUsuarioService usuarioService;
		
	@Test
	public void testSalvarUsuario() throws SiseducaException {
		Usuario usuario = new Usuario();
		usuario.setAtivo(true);
		usuario.setEmail("paulo@email.com");
		usuario.setLogin("paulo");
		usuario.setPermissao("ROLE_ADMIN");
		usuario.setSenha(DigestUtils.md5DigestAsHex("12345".getBytes()));
		usuarioService.salvar(usuario);
	}

}
