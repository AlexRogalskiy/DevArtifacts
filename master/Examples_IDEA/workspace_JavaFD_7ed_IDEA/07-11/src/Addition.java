import com.allmycode.dummiesframe.DummiesFrame;

public class Addition {

    public static void main(String[] args) {
        DummiesFrame frame = new DummiesFrame("Adding Machine");
        frame.addRow("First number");
        frame.addRow("Second number");
        frame.setButtonText("Sum");
        frame.go();
    }

    public static int calculate(int firstNumber, int secondNumber) {
        return firstNumber + secondNumber;
    }
}
