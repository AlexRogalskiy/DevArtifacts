package io.egen.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import io.egen.entity.User;

public interface UserRepository extends Repository<User, String>{
	
	public List<User> findAll();

	public Optional<User> findOne(String id);

	public Optional<User> findByEmail(String email);

	public User save(User user); //update and insert

	public void delete(User user);
}
