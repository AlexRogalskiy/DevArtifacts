public class Dog extends HousePet {
    int walksPerDay;

    public Dog(String name, double weight, int walksPerDay) {
        super(name, weight, "Woof");
        this.walksPerDay = walksPerDay;
    }

    @Override
    public void howToCareFor() {
        System.out.print("Walk " + name);
        System.out.println(" " + walksPerDay + " times each day.");
    }
}
