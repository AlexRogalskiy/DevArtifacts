package me.jonathan.api.entity;

/**
 * <b>Account entity</b>
 * 
 * @author Jonathan Zhang<br>
 *         mohistzh@gmail.com
 * @since Mar 10, 2014
 * @version 0.0.1-SNAPSHOT
 */
public class Account {
	private Integer id;
	private String name;
	private String email;
	private String address;

	public Account() {
	}

	public Account(Integer id, String name, String email, String address) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.address = address;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Override
	public String toString() {
		return this.id + "#" + this.name + "#" + this.email + "#"
				+ this.address;
	}
}
