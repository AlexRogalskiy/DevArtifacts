package ru.javabean.resumetycoon.data;

import com.google.common.collect.Sets;
import org.springframework.data.annotation.Id;

import java.util.Collections;
import java.util.Set;

public class User {

	@Id
	private String id;

	private String username;
	private String password;
    private Set<String> roles;

	public User() {
	}

	public User(String username, String password, Set<String> roles) {
		this.username = username;
		this.password = password;
        this.roles = Sets.newHashSet(roles);
	}

	@Override
	public String toString() {
		return String.format("Customer[id=%s, firstName='%s', lastName='%s', roles = %s]", id,
				username, password, roles);
	}

}
