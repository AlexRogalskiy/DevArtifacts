package ClassesAndInheritance;

import java.text.DecimalFormat;
import java.text.NumberFormat;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Oct. 03, 2015
 * <p/>
 * * instagram.com/NoRest4AWhearry
 * <p/>
 * * Project: Employee Management System
 ************************************************************/
public class EmployeeManagement {
    public static void main(String[] args) {
        Organization Inc = new Organization(15_000_000);
        Executive ceo = new Executive("Allen", "Whearry", CSuite.CEO, 13_225_000);

        NumberFormat formatter = new DecimalFormat("###,###,###.00");
        System.out.println("Last year's company profit was: $" + formatter.format(Inc.getOrgProfit()));
        System.out.printf("%s, %s (%s) - %s\n",ceo.getFullName(), ceo.getJobTitle(),
                ceo.getJobTitle().getFullTitle(), Inc.getOrgName());
        System.out.printf("%s's bonus last year was: $%s\n", ceo.getFullName(), formatter.format(ceo.getBonus(Inc)));
        System.out.printf("%s's total salary last year is: $%s\n", ceo.getFullName(), formatter.format(ceo.getSalary()));

        //set new salary
        Inc.setOrgProfit(25_555_444);
        System.out.println();
        System.out.println("This year's Company profit is: $" + formatter.format(Inc.getOrgProfit()));
        System.out.printf("%s, %s (%s) - %s\n",ceo.getFullName(), ceo.getJobTitle(),
                ceo.getJobTitle().getFullTitle(), Inc.getOrgName());
        System.out.printf("%s's bonus this year is: $%s\n", ceo.getFullName(), formatter.format(ceo.getBonus(Inc)));
        System.out.printf("%s's total salary this year is: $%s\n", ceo.getFullName(), formatter.format(ceo.getSalary()));

    }
}
