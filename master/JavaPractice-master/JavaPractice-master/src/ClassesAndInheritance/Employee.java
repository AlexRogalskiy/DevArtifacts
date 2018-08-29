package ClassesAndInheritance;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Oct. 03, 2015
 * <p/>
 * * instagram.com/NoRest4AWhearry
 * <p/>
 * * Project: Employee Management System
 ************************************************************/
public class Employee {
    private String firstName;
    private String lastName;
    private String fullName;

    Employee(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getFirstName() {return firstName;}
    public String getLastName() {return lastName;}

    public String getFullName() {
        fullName = firstName + " " + lastName;
        return fullName;
    }
}
