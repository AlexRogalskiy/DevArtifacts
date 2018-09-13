public class FullTimeEmployee extends Employee {
    private double weeklySalary;
    private double benefitDeduction;

// You get an error message in the DoPayrollTypeF class if you
// uncomment this constructor.
//    public FullTimeEmployee(double weeklySalary) {
//        this.weeklySalary = weeklySalary;
//    }

    public void setWeeklySalary(double weeklySalaryIn) {
        weeklySalary = weeklySalaryIn;
    }

    public double getWeeklySalary() {
        return weeklySalary;
    }

    public void setBenefitDeduction(double benefitDedIn) {
        benefitDeduction = benefitDedIn;
    }

    public double getBenefitDeduction() {
        return benefitDeduction;
    }

    public double findPaymentAmount() {
        return weeklySalary - benefitDeduction;
    }
}
