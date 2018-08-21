  package com.jcg.example;

  import java.util.ArrayList;
import java.util.List;

import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJacksonHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import com.jcg.example.bean.UserBean;

  public class RestTemplateExample
  {
  		public static void main(String[] args)
  		{
  			 RestTemplate restTemplate = new RestTemplate();
  			 String url = "http://localhost:8080/SpringMVCloginExample/jsp/json.jsp";

  			 List<HttpMessageConverter<?>> messageConverters = new ArrayList<HttpMessageConverter<?>>();
  			 MappingJacksonHttpMessageConverter map = new MappingJacksonHttpMessageConverter();
  			 messageConverters.add(map);
  			 restTemplate.setMessageConverters(messageConverters);

  			 UserBean bean = restTemplate.getForObject(url, UserBean.class);

  			 System.out.println("The object received from REST call : "+bean);
  		}
  }
