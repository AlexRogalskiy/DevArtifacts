package me.jonathan.api.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import me.jonathan.api.entity.Account;

import org.codehaus.jackson.JsonEncoding;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
/**
 * (non-Javadoc)
 *
 * @author 	Jonathan Zhang<br>
 *			mohistzh@gmail.com
 * @since   Mar 10, 2014
 * @version 0.0.1-SNAPSHOT
 * 
 */
public class JacksonUtilTester {

	private JsonGenerator jsonGenerator = null;
	private ObjectMapper objectMapper = null;
	private Account account = null;

	@Before
	public void init() {
		account = new Account();
		account.setId(1);
		account.setName("Xiao Feng Zhang");
		account.setEmail("mohistzh@gmail.com");
		account.setAddress("Shanghai, China");
		objectMapper = new ObjectMapper();
		try {
			jsonGenerator = objectMapper.getJsonFactory().createJsonGenerator(System.out,
					JsonEncoding.UTF8);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	@Test
	public void testEntityJson() {
		try {
			System.out.println("Json Generator");
			jsonGenerator.writeObject(account);
			System.out.println();
			System.out.println("Object Mapper");
			objectMapper.writeValue(System.out, account);
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	@Test
	public void testMapJson() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("name", account.getName());
		map.put("account", account);
		account = new Account();
		account.setAddress("Changsha");
		account.setEmail("stephensh@foxmail.com");
		map.put("account2", account);
		try {
			System.out.println("Json Generator");
			jsonGenerator.writeObject(map);
			System.out.println();
			System.out.println("Object Mapper");
			objectMapper.writeValue(System.out, map);
		} catch (JsonGenerationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	@After
	public void destory() {
		try {
			if (jsonGenerator != null) {
				jsonGenerator.flush();
			}
			if (!jsonGenerator.isClosed()) {
				jsonGenerator.close();
			}
			jsonGenerator =null;
			objectMapper =null;
			account =null;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
