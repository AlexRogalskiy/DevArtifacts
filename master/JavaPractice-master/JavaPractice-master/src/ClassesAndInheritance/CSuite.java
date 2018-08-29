package ClassesAndInheritance;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Oct. 03, 2015
 * <p/>
 * * instagram.com/NoRest4AWhearry
 * <p/>
 * * Project: JavaPractice
 ************************************************************/
public enum CSuite {
    CEO("Chief Executive Officer"), CFO("Chief Financial Officer"), COO("Chief Operations Officer"),
    CTO("Chief Technical Officer");

    private String fullTitle;

    CSuite(String fullTitle) {
        this.fullTitle = fullTitle;
    }

    public String getFullTitle(){
        return fullTitle;
    }
}
