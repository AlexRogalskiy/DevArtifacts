package com.jcg.prop;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * @author ashraf
 *
 */
@Component
public class DatabaseProperties {

	@Value("${db.driverClass}")
	private String driverClass;

	@Value("${db.connectionURL}")
	private String connectionURL;

	@Value("${db.username}")
	private String username;

	@Value("${db.password}")
	private String password;

	public String getDriverClass() {
		return driverClass;
	}

	public String getConnectionURL() {
		return connectionURL;
	}

	public String getUsername() {
		return username;
	}

	public String getPassword() {
		return password;
	}

	@Override
	public String toString() {
		return "DatabaseProperties [driverClass=" + driverClass
				+ ", connectionURL=" + connectionURL + ", username=" + username
				+ ", password=" + password + "]";
	}

}
