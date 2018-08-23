package com.mkyong.core;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.mkyong.config.SpringMongoConfig;
import com.mkyong.user.User;

public class App {

	public static void main(String[] args) {
		// For Annotation
		ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringMongoConfig.class);
		MongoOperations mongoOperation = (MongoOperations) ctx.getBean("mongoTemplate");

		// Case1 - insert a user, put "tableA" as collection name
		System.out.println("Case 1...");
		User userA = new User("1000", "apple", 54, new Date());
		mongoOperation.save(userA, "tableA");

		// find
		Query findUserQuery = new Query();
		findUserQuery.addCriteria(Criteria.where("ic").is("1000"));
		User userA1 = mongoOperation.findOne(findUserQuery, User.class, "tableA");
		System.out.println(userA1);

		// Case2 - insert a user, put entity as collection name
		System.out.println("Case 2...");
		User userB = new User("2000", "orange", 64, new Date());
		mongoOperation.save(userB);

		// find
		User userB1 = mongoOperation.findOne(new Query(Criteria.where("age").is(64)), User.class);
		System.out.println(userB1);

		// Case3 - insert a list of users
		System.out.println("Case 3...");
		User userC = new User("3000", "metallica", 34, new Date());
		User userD = new User("4000", "metallica", 34, new Date());
		User userE = new User("5000", "metallica", 34, new Date());
		List<User> userList = new ArrayList<User>();
		userList.add(userC);
		userList.add(userD);
		userList.add(userE);
		mongoOperation.insert(userList, User.class);

		// find
		List<User> users = mongoOperation.find(new Query(Criteria.where("name").is("metallica")),
				User.class);

		for (User temp : users) {
			System.out.println(temp);
		}
		
		//save vs insert
		System.out.println("Case 4...");
		User userD1 = mongoOperation.findOne(new Query(Criteria.where("age").is(64)), User.class);
		userD1.setName("new name");
		userD1.setAge(100);
		
		//E11000 duplicate key error index, _id existed
		//mongoOperation.insert(userD1); 
		mongoOperation.save(userD1);
		User userE1 = mongoOperation.findOne(new Query(Criteria.where("age").is(100)), User.class);
		System.out.println(userE1);
	}

}
