public abstract class HousePet extends Animal {
    String name;

    public HousePet(String name, double weight, String sound) {
        super(weight, sound);
        this.name = name;
    }

    abstract public void howToCareFor();

    public void about() {
        System.out.print(name + " weighs " + weight + " pounds");
        System.out.print(sound != null ? (" and says '" + sound + "'") : "");
        System.out.println(".");
    }
}
