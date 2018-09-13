import java.text.NumberFormat;
import java.util.ArrayList;

public class TallySales {

  public static void main(String[] args) {
    ArrayList<Sale> sales = new ArrayList<>();
    NumberFormat currency = NumberFormat.getCurrencyInstance();

    fillTheList(sales);

    double total = sales.stream()
                        .filter((sale) -> sale.getItem().equals("DVD"))
                        .map((sale) -> sale.getPrice())
                        .reduce(0.0, (price1, price2) -> price1 + price2);

    System.out.println(currency.format(total));
  }

  static void fillTheList(ArrayList<Sale> sales) {
    sales.add(new Sale("DVD", 15.00));
    sales.add(new Sale("Book", 12.00));
    sales.add(new Sale("DVD", 21.00));
    sales.add(new Sale("CD", 5.25));
  }
}
