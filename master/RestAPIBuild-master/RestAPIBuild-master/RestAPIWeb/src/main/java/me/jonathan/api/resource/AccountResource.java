package me.jonathan.api.resource;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import me.jonathan.api.entity.Account;
import me.jonathan.sp.AccountManagement;
import me.jonathan.sp.impl.AccountManagementImpl;

/**
 * account api, url(/account)
 * 
 * @author Jonathan Zhang<br>
 *         mohistzh@gmail.com
 * @since Mar 21, 2014
 * @version
 */
@Path("account")
public class AccountResource {
	/**
	 * Get account entity by account id
	 * 
	 * @param id
	 * @return me.jonathan.api.entity.Account
	 */
	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Account getAccountById(@PathParam("id") Integer id) {
		AccountManagement am = new AccountManagementImpl();
		me.jonathan.sp.bean.Account account = am.getAccountById(id);
		return new Account(account.getId(), account.getName(),
				account.getEmail(), account.getAddress());

	}
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Account> getAccounts() {
		List<Account> list = new ArrayList<Account>();
		for (int i = 0; i < 10; i++) {
			Account account = new Account();
			account.setId(i);
			account.setName("Jonathan-"+i);
			account.setEmail("mohistzh@gmail.com-"+i);
			account.setAddress("Shanghai, China-"+i);
			list.add(account);
		}
		return list;
	}
}
