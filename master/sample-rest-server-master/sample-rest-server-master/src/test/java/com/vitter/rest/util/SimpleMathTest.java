package com.vitter.rest.util;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class SimpleMathTest {
	
	private SimpleMath sm;
	
	@Before
	public void setUp() throws Exception {
		sm = new SimpleMath();
	}

	@After
	public void tearDown() throws Exception {
		sm = null;
	}

	@Test
	public void testAddTwoNumbersInteger() {
		int result = sm.addTwoNumbers(0, 0);
		assertTrue(result == 0);
	}
	
	@Test
	public void testAddTwoNumbersDouble() {
		Double result = sm.addTwoNumbers(0.0, 0.0);
		assertTrue(result == 0.0);
	}
	
	@Test
	public void testSubtractTwoNumbersInteger() {
		int result = sm.subtractTwoNumbers(0, 0);
		assertTrue(result == 0);
	}
	
	@Test
	public void testSubtractTwoNumbersDouble() {
		Double result = sm.subtractTwoNumbers(0.0, 0.0);
		assertTrue(result == 0.0);
	}

}
