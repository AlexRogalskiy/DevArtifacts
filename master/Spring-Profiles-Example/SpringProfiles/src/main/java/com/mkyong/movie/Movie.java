package com.mkyong.movie;

import java.io.Serializable;

public class Movie implements Serializable {

	private static final long serialVersionUID = 1L;

	int id;
	String name;
	String directory;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDirectory() {
		return directory;
	}

	public void setDirectory(String directory) {
		this.directory = directory;
	}

	public Movie(int id, String name, String directory) {
		super();
		this.id = id;
		this.name = name;
		this.directory = directory;
	}

	@Override
	public String toString() {
		return "Movie [id=" + id + ", name=" + name + ", directory=" + directory + "]";
	}

}