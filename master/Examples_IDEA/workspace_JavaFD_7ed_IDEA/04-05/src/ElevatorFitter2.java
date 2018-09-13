public class ElevatorFitter2 {

    public static void main(String args[]) {
        System.out.println("True or False?");
        System.out.println("You can fit all ten of the");
        System.out.println("Brickenchicker dectuplets");
        System.out.println("on the elevator:");
        System.out.println();

        int weightOfAPerson = 150;
        int elevatorWeightLimit = 1400;
        int numberOfPeople = elevatorWeightLimit / weightOfAPerson;
        
        boolean allTenOkay = numberOfPeople >= 10;

        System.out.println(allTenOkay);
    }
}
