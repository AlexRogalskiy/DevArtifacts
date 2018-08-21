package com.simplesciences;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

// help from - http://crunchify.com/how-to-build-restful-service-with-java-using-jax-rs-and-jersey/

@Path("/buffflow")
public class BuffFlow {
    @GET
    @Produces("application/xml")
    public String BuffFlow() {

        String result = "@Produces(\"application/xml\") Output: \n\n Buffer Overflow : \n\n";
        return "<buffferlow>" + "<Buff>1</Buff>" + "<buffflow>" + result + "</buffflow>" + "</buffferlow>";
    }

    @Path("{Buff}")
    @GET
    @Produces()
    public String StrangeExample(@PathParam("Buff") String Buff) 
    {
        int importantData =1;
        int[]  buffer = new int[10];
    
     //   try
      //  {
            for (int i =0; i < 15; i++)
            {
               // System.out.println( i); // commneting out as this is not causing buffer over flow condition jdk 1.8
                buffer[i] = 1 + i;
               // System.out.println( buffer[i]);  // commneting out as this is not causing buffer over flow condition jdk 1.8
                importantData = importantData + buffer[i];
            }
      /*  }
        catch (Exception e)
        {
           // System.out.println("I caught an exception" + e.getMessage());
           //??? what should be done here :-/
        }
        */
        String result = "@Produces(\"application/xml\") Output: \n\nStrange function for Buffer Overflow: \n\n" + importantData;
        return "<BUFF><buff>buff</buff>" + "<b>" + result + "</b>" + "</BUFF>";
        
    //    System.out.println("after buffer overflow ");
    //    System.out.println("Important data  = "+importantData);
    }
}
