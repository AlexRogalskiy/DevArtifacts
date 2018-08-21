package restAPIDemo;


import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

public class HudsonCall {
  
   public static void kickOffJenkinsDemo() throws Exception
   {
     
     URL url = new URL("http://localhost:8080/jenkins/job/JenkinsDemo/build?token=pavanToken");
     
     HttpURLConnection connection = (HttpURLConnection)url.openConnection();
     connection.setRequestMethod("GET");
     connection.connect();
     connection.getResponseCode();

   }
   
   public static void lastBuildInfo() throws Exception
   {
     URL url = new URL("http://localhost:8080/jenkins/job/JenkinsDemo/api/xml");

     Document dom = new SAXReader().read(url);

     for( Element job : (List<Element>)dom.getRootElement().elements("build")) {
       String buildNumber = job.elementText("number");
       
         System.out.println(String.format("Number:%s\tURL:%s",
         buildNumber, job.elementText("url")));
         
         URL numURL = new URL("http://localhost:8080/jenkins/job/JenkinsDemo/"+ 
         buildNumber +"/api/xml");
         Document numDom = new SAXReader().read(numURL);
         
         Element result = numDom.getRootElement().element("result");
         
         System.out.println(String.format("Build: %s \t Result:%s", 
           buildNumber, result.getText()));
         if(result.getText().equals("SUCCESS"))
         {
           System.out.println("Last Successful Build: "+ buildNumber);
           break;
         }
         
     }
   }

    public static void main(String[] args) throws Exception {
          kickOffJenkinsDemo();
          lastBuildInfo();
          System.out.println("Done Rest API Call");
            
    }
}
