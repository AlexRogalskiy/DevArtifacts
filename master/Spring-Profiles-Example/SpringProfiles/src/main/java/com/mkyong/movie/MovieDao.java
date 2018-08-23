package com.mkyong.movie;

public interface MovieDao{
	
	Movie findByDirector(String name);
	
}