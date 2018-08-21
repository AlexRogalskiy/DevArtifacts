package com.env.test;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.jcg.prop.GenericEnv;

/**
 * @author ashraf
 *
 */
@Component
public class TestEnv implements GenericEnv {

	private String envName = "test";

	@Value("${profile.name}")
	private String profileName;

	public String getEnvName() {
		return envName;
	}

	public void setEnvName(String envName) {
		this.envName = envName;
	}

	public String getProfileName() {
		return profileName;
	}

	public void setProfileName(String profileName) {
		this.profileName = profileName;
	}

	@Override
	public String toString() {
		return "TestEnv [envName=" + envName + ", profileName=" + profileName
				+ "]";
	}
	
}
