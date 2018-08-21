package com.test.jenkins.api;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.xml.bind.DatatypeConverter;


public class Main {

	  public static void main(String[] args) {
	    try {
	      URL url = new URL ("http://localhost:8080/"); // Jenkins URL localhost:8080, job named 'test'
	      String user = "admin"; // username
	      String pass = "afe8a2414f56f764d3da5026e362f775"; // password or API token
	      String authStr = user +":"+  pass;
	      String encoding = DatatypeConverter.printBase64Binary(authStr.getBytes("utf-8"));

	      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	      connection.setRequestMethod("POST");
	      connection.setDoOutput(true);
	      connection.setRequestProperty("Authorization", "Basic " + encoding);
	      InputStream content = connection.getInputStream();
	      BufferedReader in   =
	          new BufferedReader (new InputStreamReader (content));
	      String line;
	      while ((line = in.readLine()) != null) {
	        System.out.println(line);
	      }
	    } catch(Exception e) {
	      e.printStackTrace();
	    }
	  }
	}
