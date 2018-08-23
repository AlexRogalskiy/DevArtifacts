package com.mkyong.movie;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

@Repository("movieDao")
public class MovieDaoImpl implements MovieDao{

	@Cacheable(value="movieFindCache", key="#name")
	public Movie findByDirector(String name) {
		slowQuery(2000L);
		System.out.println("findByDirector is running...");
		return new Movie(1,"Forrest Gump","Robert Zemeckis");
	}
	
	private void slowQuery(long seconds){
		try {
            Thread.sleep(seconds);
        } catch (InterruptedException e) {
            throw new IllegalStateException(e);
        }
	}
	
}