import com.allmycode.dummiesframe.DummiesFrame;

public class UseAccount {

    public static void main(String args[]) {
        DummiesFrame frame = new DummiesFrame("Display an Account");
        frame.addRow("Full name");
        frame.addRow("Address");
        frame.addRow("Balance");
        frame.setButtonText("Display");
        frame.go();
    }

    public static String calculate(String name, String address,
                                                double balance) {
        Account myAccount = new Account();

        myAccount.setName(name);
        myAccount.setAddress(address);
        myAccount.setBalance(balance);
        return myAccount.getName() + " (" + myAccount.getAddress() +
                ") has $" + myAccount.getBalance();
    }
}
