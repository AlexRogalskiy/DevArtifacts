package ClassesAndInheritance;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Oct. 03, 2015
 * <p/>
 * * instagram.com/NoRest4AWhearry
 * <p/>
 * * Project: JavaPractice
 ************************************************************/
public class Organization {
    private String orgName = "Whearry Inc.";
    private double orgProfit;

    Organization(double orgProfit) {
        this.orgProfit = orgProfit;
    }


    public double getOrgProfit() {
        return orgProfit;
    }

    public void setOrgProfit(double orgProfit) {
        this.orgProfit = orgProfit;
    }

    public String getOrgName() {
        return orgName;
    }
}
