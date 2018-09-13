import static java.lang.System.out;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.NumberFormat;

public class GetData {
  
  public static void main(String args[]) {
    NumberFormat currency = NumberFormat.getCurrencyInstance();
    final String CONNECTION = "jdbc:derby:AccountDatabase";

    try (Connection conn = DriverManager.getConnection(CONNECTION);
         Statement statement = conn.createStatement();
         ResultSet resultset = statement.executeQuery("select * from ACCOUNTS")) 
    {
      
      while (resultset.next()) {
        out.print(resultset.getString("NAME"));
        out.print(", ");
        out.print(resultset.getString("ADDRESS"));
        out.print(" ");
        out.println(currency.format(resultset.getFloat("BALANCE")));
      }
      
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }
}
