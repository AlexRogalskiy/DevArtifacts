package ru.java.courses.football;

public class Person {
    private String name;

    public Person(String name) {
        this.checkName(name);

        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.checkName(name);

        this.name = name;
    }

    private void checkName(String name) {
        if (name == null || name.trim().equals("")) {
            throw new RuntimeException("Нельзя задать пустое имя!");
        }
    }
}
