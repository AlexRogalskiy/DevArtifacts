package com.mkyong.model;

import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Indexed
@Entity
public class BaseballCard {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Field
    private String name;
    @Field
    private String rarityLevel;
    @Field
    private int year;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRarityLevel() {
        return rarityLevel;
    }

    public void setRarityLevel(String rarityLevel) {
        this.rarityLevel = rarityLevel;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

}
