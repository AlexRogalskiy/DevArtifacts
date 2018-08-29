package ru.javabean.resumetycoon.data;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

	public User findByUsername(String firstName);

//	public List<User> findByLastName(String lastName);

}
