package ClassesAndInheritance;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Oct. 03, 2015
 * <p/>
 * * instagram.com/NoRest4AWhearry
 * <p/>
 * * Project: Employee Management System
 ************************************************************/
public class Executive extends Employee {
    private CSuite jobTitle;
    private double salary;
    private double executiveBomus;

    Executive(String firstName, String lastName, CSuite jobTitle , double salary) {
        super(firstName, lastName);
        this.jobTitle = jobTitle;
        this.salary = salary;
    }

    public CSuite getJobTitle() {return jobTitle; }

    public double getSalary() {
        return salary + executiveBomus;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public double getBonus(Organization org) {
        executiveBomus = 17.32 * org.getOrgProfit() / 100;
        return executiveBomus;
    }

    public void setBonus(double bonus) {
        this.executiveBomus = bonus;
    }
}
