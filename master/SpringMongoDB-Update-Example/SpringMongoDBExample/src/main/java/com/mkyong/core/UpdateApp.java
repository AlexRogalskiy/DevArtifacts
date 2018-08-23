package com.mkyong.core;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.mkyong.config.SpringMongoConfig;
import com.mkyong.model.User;

public class UpdateApp {

	public static void main(String[] args) {
		// For Annotation
		ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringMongoConfig.class);
		MongoOperations mongoOperation = (MongoOperations) ctx.getBean("mongoTemplate");

		// insert 6 users for testing
		List<User> users = new ArrayList<User>();

		User user1 = new User("1001", "appleA", 20, new Date());
		User user2 = new User("1002", "appleB", 20, new Date());
		User user3 = new User("1003", "appleC", 20, new Date());
		User user4 = new User("1004", "appleD", 20, new Date());
		User user5 = new User("1005", "appleE", 20, new Date());
		User user6 = new User("1006", "appleF", 20, new Date());
		users.add(user1);
		users.add(user2);
		users.add(user3);
		users.add(user4);
		users.add(user5);
		users.add(user6);
		mongoOperation.insert(users, User.class);

		// Case 1 ... find and update
		System.out.println("Case 1");

		Query query1 = new Query();
		query1.addCriteria(Criteria.where("name").is("appleA"));

		User userTest1 = mongoOperation.findOne(query1, User.class);

		System.out.println("userTest1 - " + userTest1);

		userTest1.setAge(99);
		mongoOperation.save(userTest1);

		User userTest1_1 = mongoOperation.findOne(query1, User.class);

		System.out.println("userTest1_1 - " + userTest1_1);

		// Case 2 ... select single field only
		System.out.println("\nCase 2");

		Query query2 = new Query();
		query2.addCriteria(Criteria.where("name").is("appleB"));
		query2.fields().include("name");

		User userTest2 = mongoOperation.findOne(query2, User.class);
		System.out.println("userTest2 - " + userTest2);

		userTest2.setAge(99);

		mongoOperation.save(userTest2);

		// ooppss, you just override everything, it caused ic=null and
		// createdDate=null

		Query query2_1 = new Query();
		query2_1.addCriteria(Criteria.where("name").is("appleB"));

		User userTest2_1 = mongoOperation.findOne(query2_1, User.class);
		System.out.println("userTest2_1 - " + userTest2_1);

		System.out.println("\nCase 3");
		Query query3 = new Query();
		query3.addCriteria(Criteria.where("name").is("appleC"));
		query3.fields().include("name");

		User userTest3 = mongoOperation.findOne(query3, User.class);
		System.out.println("userTest3 - " + userTest3);

		Update update3 = new Update();
		update3.set("age", 100);

		mongoOperation.updateFirst(query3, update3, User.class);

		Query query3_1 = new Query();
		query3_1.addCriteria(Criteria.where("name").is("appleC"));

		User userTest3_1 = mongoOperation.findOne(query3_1, User.class);
		System.out.println("userTest3_1 - " + userTest3_1);

		System.out.println("\nCase 4");
		Query query4 = new Query();
		query4.addCriteria(Criteria
				.where("name")
				.exists(true)
				.orOperator(Criteria.where("name").is("appleD"),
						Criteria.where("name").is("appleE")));
		Update update4 = new Update();
		update4.set("age", 11);
		update4.unset("createdDate");

		// update 1004 only.
		// mongoOperation.updateFirst(query4, update4, User.class);

		// update all matched
		mongoOperation.updateMulti(query4, update4, User.class);

		System.out.println(query4.toString());

		List<User> usersTest4 = mongoOperation.find(query4, User.class);

		for (User userTest4 : usersTest4) {
			System.out.println("userTest4 - " + userTest4);
		}

		System.out.println("\nCase 5");
		Query query5 = new Query();
		query5.addCriteria(Criteria.where("name").is("appleZ"));

		Update update5 = new Update();
		update5.set("age", 21);

		mongoOperation.upsert(query5, update5, User.class);

		User userTest5 = mongoOperation.findOne(query5, User.class);
		System.out.println("userTest5 - " + userTest5);

		System.out.println("\nCase 6");
		Query query6 = new Query();
		query6.addCriteria(Criteria.where("name").is("appleF"));

		Update update6 = new Update();
		update6.set("age", 101);
		update6.set("ic", 1111);

		User userTest6 = mongoOperation.findAndModify(query6, update6,
				new FindAndModifyOptions().returnNew(true), User.class);
		System.out.println("userTest6 - " + userTest6);

		mongoOperation.dropCollection(User.class);

	}

}
