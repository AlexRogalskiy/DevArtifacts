import javax.swing.JOptionPane;

public class Authenticator {

    public static void main(String args[]) {

        String username = JOptionPane.showInputDialog("Username:");
        String password = JOptionPane.showInputDialog("Password:");

        if (
              username != null && password != null &&
              (
                (username.equals("bburd") && password.equals("swordfish")) ||
                (username.equals("hritter") && password.equals("preakston"))
              )
           )
        {
            JOptionPane.showMessageDialog(null, "You're in.");
        } else {
            JOptionPane.showMessageDialog(null, "You're suspicious.");
        }
    }
}
