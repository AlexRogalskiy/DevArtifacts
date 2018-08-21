package com.pauloneto.minhaescola.test.servico;

import junit.framework.TestCase;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.pauloneto.minhaescola.comuns.modelo.ItemMenu;
import com.pauloneto.minhaescola.comuns.modelo.Menu;
import com.pauloneto.minhaescola.comuns.modelo.SubMenu;
import com.pauloneto.minhaescola.comuns.modelo.Usuario;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.negocio.interfaces.IMenuService;
import com.pauloneto.minhaescola.negocio.interfaces.IUsuarioService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext-test.xml")
public class MenuServicoTest extends TestCase{

	@Autowired
	private IMenuService menuServico;
	
	@Autowired
	private IUsuarioService usuarioService;
	
	@Before
	public void setUp() throws Exception {
		super.setUp();
	}

	@Ignore
	public void testConsultarPorUsuario() {
		fail("Not yet implemented");
	}

	@Test
	public void testSalvarMenu() throws SiseducaException{
		Menu menu = new Menu();
		SubMenu subMenu01 = new SubMenu();
		subMenu01.setOrdem(1);
		subMenu01.setDsSubMenu("Matriculas");
		
		ItemMenu itemMenu01SubMenu01 = new ItemMenu();
		itemMenu01SubMenu01.setDsItemMenu("Matricula Ensino Fundamental");
		itemMenu01SubMenu01.setOrdem(1);
		itemMenu01SubMenu01.setUrl("matriculaAlunoEnsinoFundamental.jsf");
		
		subMenu01.addItemMenu(itemMenu01SubMenu01);
		
		menu.addSubMenu(subMenu01);
		menuServico.salvar(menu);
//		Usuario usuario = usuarioService.pesquisarPorLogin("paulo"); 
//		Menu menuBD = menuServico.pesquisarPorId(Menu.class, 7);
//		usuario.setMenu(menuBD);
//		usuarioService.atualizar(usuario);
	}
}
