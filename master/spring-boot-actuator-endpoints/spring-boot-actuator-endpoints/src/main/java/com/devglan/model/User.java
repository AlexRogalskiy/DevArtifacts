package com.devglan.model;

/**
 * Created by Kusumitha K on 10-02-2017.
 */
public class User {

    private String id;
    private String firstname;
    private String lastName;
    private String address;

    public User(String id, String firstname, String lastName, String address) {
        this.id = id;
        this.firstname = firstname;
        this.lastName = lastName;
        this.address = address;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

}
