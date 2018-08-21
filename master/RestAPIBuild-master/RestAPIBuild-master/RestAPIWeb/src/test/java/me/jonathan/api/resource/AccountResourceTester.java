package me.jonathan.api.resource;

import java.util.List;

import me.jonathan.api.entity.Account;

import org.junit.Before;
import org.junit.Test;
/**
 * AccountResource unit test
 *
 * @author 	Jonathan Zhang<br>
 *			mohistzh@gmail.com
 * @since   Mar 24, 2014
 * @version 0.0.1-SNAPSHOT
 */
public class AccountResourceTester {

	private AccountResource ar = null;
	@Before
	public void init() {
		ar = new AccountResource();
	}
	@Test
	public void testGetAccounts() {
		List<Account> list = ar.getAccounts();
		for(Account account:list) {
			System.out.println(account.getName());
		}
		
	}
	@Test
	public void testGetAccountById() {
		Account account = ar.getAccountById(1);
		System.out.println(account.getEmail());
	}
}
