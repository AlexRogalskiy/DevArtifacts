package com.pauloneto.minhaescola.test.servico;

import static org.junit.Assert.fail;

import java.util.Date;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.pauloneto.minhaescola.comuns.modelo.AnoLetivo;
import com.pauloneto.minhaescola.comuns.util.CalendarioUtil;
import com.pauloneto.minhaescola.comuns.util.excecao.SiseducaException;
import com.pauloneto.minhaescola.negocio.interfaces.IAnoLetivoService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext-test.xml")
public class AnoLetivoServicoTest {

	@Autowired
	private IAnoLetivoService anoLetivoService;
	
	@Before
	public void setUp() throws Exception {
	}

	@Ignore
	public void testPesquisarTodos() {
		fail("Not yet implemented");
	}

	@Test
	public void testSalvar() throws SiseducaException {
		AnoLetivo anoLetivo = new AnoLetivo();
		anoLetivo.setDataInicio(new Date());
		anoLetivo.setDataTerminio(CalendarioUtil.getData(20, 12, 2015));
		anoLetivo.setNome("Ano Letivo 2015");
		anoLetivoService.salvar(anoLetivo);
	}

	@Ignore
	public void testAtualizar() {
		fail("Not yet implemented");
	}

	@Ignore
	public void testRemover() {
		fail("Not yet implemented");
	}

	@Ignore
	public void testPesquisarPorId() {
		fail("Not yet implemented");
	}

}
