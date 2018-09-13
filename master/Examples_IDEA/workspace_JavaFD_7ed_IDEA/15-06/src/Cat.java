public class Cat extends HousePet {
    boolean isOutdoor;

    public Cat(String name, double weight, boolean isOutdoor) {
        super(name, weight, "Meow");
        this.isOutdoor = isOutdoor;
    }

    @Override
    public void howToCareFor() {
        System.out.println(
          isOutdoor ? "Let " : "Do not let " + name + " outdoors.");
    }
}
