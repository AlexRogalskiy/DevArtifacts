import static java.lang.System.out;

public class GoodNightsSleepB {

    public static void main(String args[]) {
        out.print("Excuse me while I nap ");
        out.println("for just five seconds...");

        try {
            takeANap();
        } catch (InterruptedException e) {
            out.println("Hey, who woke me up?");
        }

        out.println("Ah, that was refreshing.");
    }

    static void takeANap() throws InterruptedException {
        Thread.sleep(5000);
    }
}
