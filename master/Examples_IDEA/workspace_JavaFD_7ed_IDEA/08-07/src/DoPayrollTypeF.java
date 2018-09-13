public class DoPayrollTypeF {

  public static void main(String args[]) {

    FullTimeEmployee ftEmployee = new FullTimeEmployee();

    ftEmployee.setName("Barry Burd");
    ftEmployee.setJobTitle("CEO");
    ftEmployee.setWeeklySalary(5000.00);
    ftEmployee.setBenefitDeduction(500.00);
    ftEmployee.cutCheck(ftEmployee.findPaymentAmount());

    PartTimeEmployee ptEmployee = new PartTimeEmployee();

    ptEmployee.setName("Chris Apelian");
    ptEmployee.setJobTitle("Computer Book Author");
    ptEmployee.setHourlyRate(7.53);
    ptEmployee.cutCheck(ptEmployee.findPaymentAmount(50));

    PartTimeWithOver ptoEmployee = new PartTimeWithOver();

    ptoEmployee.setName("Steve Surace");
    ptoEmployee.setJobTitle("Driver");
    ptoEmployee.setHourlyRate(7.53);
    ptoEmployee.cutCheck(ptoEmployee.findPaymentAmount(50));
  }
}
