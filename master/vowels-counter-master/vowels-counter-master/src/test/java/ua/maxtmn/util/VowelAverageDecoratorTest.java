package ua.maxtmn.util;

import junit.framework.TestCase;

public class VowelAverageDecoratorTest extends TestCase {

	public void test_type() throws Exception {
		assertNotNull(VowelAverageDecorator.class);
	}

	public void test_instantiation_null() throws Exception {
		String result = null;
		VowelAverageDecorator target = new VowelAverageDecorator(result);
		assertNotNull(target);
	}
	
	public void test_instantiation_empty() throws Exception {
		String result = "";
		VowelAverageDecorator target = new VowelAverageDecorator(result);
		assertNotNull(target);
	}

	public void test_toString_A$() throws Exception {
		String result = "nothing to decorate";
		VowelAverageDecorator target = new VowelAverageDecorator(result);
		String actual = target.toString();
		String expected = result;
		assertEquals(expected, actual);
	}
	
	public void test_toString_B$() throws Exception {
		String result = "=";
		VowelAverageDecorator target = new VowelAverageDecorator(result);
		String actual = target.toString();
		String expected = " -> ";
		assertEquals(expected, actual);
	}
	
	public void test_toString_C$() throws Exception {
		String result = null;
		VowelAverageDecorator target = new VowelAverageDecorator(result);
		String actual = target.toString();
		String expected = "";
		assertEquals(expected, actual);
	}
	
	public void test_decorateResult_A$() throws Exception {
		String result = "nothing to decorate";
		String actual = VowelAverageDecorator.decorateResult(result);
		String expected = result;
		assertEquals(expected, actual);
	}
	
	public void test_decorateResult_B$() throws Exception {
		String result = "=";
		String actual = VowelAverageDecorator.decorateResult(result);
		String expected = " -> ";
		assertEquals(expected, actual);
	}
	
	public void test_decorateResult_C$() throws Exception {
		String result = null;
		String actual = VowelAverageDecorator.decorateResult(result);
		String expected = "";
		assertEquals(expected, actual);
	}

}
