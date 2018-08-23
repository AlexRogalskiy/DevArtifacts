package com.mkyong.core;

import java.io.IOException;
import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.GenericXmlApplicationContext;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.gridfs.GridFSDBFile;

/**
 * GridFs example
 * 
 * @author mkyong
 * 
 */

public class GridFsAppRead {

	public static void main(String[] args) {

		ApplicationContext ctx = new GenericXmlApplicationContext("SpringConfig.xml");
		GridFsOperations gridOperations = (GridFsOperations) ctx.getBean("gridFsTemplate");

		List<GridFSDBFile> result = gridOperations.find(new Query().addCriteria(Criteria.where(
				"filename").is("testing.png")));
		for (GridFSDBFile file : result) {
			try {
				System.out.println(file.getFilename());
				System.out.println(file.getContentType());
				
				//save as another image
				file.writeTo("/Users/mkyong/Downloads/new-testing.png");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		System.out.println("Done");

	}

}
