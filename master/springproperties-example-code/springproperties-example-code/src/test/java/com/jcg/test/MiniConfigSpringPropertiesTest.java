package com.jcg.test;

import junit.framework.TestCase;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.jcg.prop.DatabaseProperties;
import com.jcg.prop.GenericEnv;
import com.jcg.prop.JmsProperties;

/**
 * @author ashraf
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/mini-xml-config-context.xml")
public class MiniConfigSpringPropertiesTest extends TestCase {
	
	@Autowired
	private GenericEnv env;
	
	@Autowired
	private DatabaseProperties dbProp;
	
	@Autowired
	private JmsProperties jmsProp;
	
	@Test
	public void testAppProperties() {
		
		System.out.println("Running MiniConfigSpringPropertiesTest ...");
		
		System.out.println("Environment        : " + env.toString());
		
		System.out.println("Database Properties: " + dbProp.toString());
		
		System.out.println("JMS Properties     : " + jmsProp.toString());
	
	}
	
}