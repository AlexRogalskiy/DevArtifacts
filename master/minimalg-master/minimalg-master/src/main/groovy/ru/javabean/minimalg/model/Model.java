package ru.javabean.minimalg.model;


/**
 * A simple entity to hold credentials
 *
 * @author Michael Koltsov {@see <a href="https://github.com/mkoltsov">Github</a>}
 */
public class Model {
    @SuppressWarnings("unused")
    private String email;
    @SuppressWarnings("unused")
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
