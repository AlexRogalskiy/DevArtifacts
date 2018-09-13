public class Main {

    public static void main(String[] args) {
        double numbers[] = { 21.7, 68.3, 5.5 };
        ColumnOfNumbers column = new ColumnOfNumbers(numbers);

        displayMe(column);
        summarizeMe(column);

        Table table = new Table("MyTable.txt");

        displayMe(table);
        summarizeMe(table);
    }

    static void displayMe(Displayable displayable) {
        displayable.display();
        System.out.println();
    }

    static void summarizeMe(Summarizable summarizable) {
        System.out.println(summarizable.summarize());
        System.out.println();
    }
}
