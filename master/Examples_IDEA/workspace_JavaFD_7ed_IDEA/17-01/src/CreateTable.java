import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class CreateTable {

  public static void main(String args[]) {
    
    final String CONNECTION = "jdbc:derby:AccountDatabase;create=true";

    try (Connection conn = DriverManager.getConnection(CONNECTION);
         Statement statement = conn.createStatement()) {
      
      statement.executeUpdate("create table ACCOUNTS                     " + 
                              "  (NAME VARCHAR(32) NOT NULL PRIMARY KEY, " +
                              "   ADDRESS VARCHAR(32),                   " + 
                              "   BALANCE FLOAT                         )");
      System.out.println("ACCOUNTS table created.");

    } catch (SQLException e) {
      e.printStackTrace();
    }
  }
}