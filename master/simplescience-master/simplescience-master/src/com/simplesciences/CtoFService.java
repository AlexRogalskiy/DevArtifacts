package com.simplesciences;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

// help from - http://crunchify.com/how-to-build-restful-service-with-java-using-jax-rs-and-jersey/

@Path("/ctofservice")
public class CtoFService {
    @GET
    @Produces("application/xml")
    public String convertCtoF() {

        Double fahrenheit;
        Double celsius = 36.8;
        fahrenheit = ((celsius * 9) / 5) + 32;

        String result = "@Produces(\"application/xml\") Output: \n\nC to F Converter Output: \n\n" + fahrenheit;
        return "<ctofservice>" + "<celsius>" + celsius + "</celsius>" + "<ctofoutput>" + result + "</ctofoutput>" + "</ctofservice>";
    }

    @Path("{c}")
    @GET
    @Produces("application/xml")
    public String convertCtoFfromInput(@PathParam("c") Double c) {
        Double fahrenheit;
        Double celsius = c;
        fahrenheit = ((celsius * 9) / 5) + 32;

        String result = "@Produces(\"application/xml\") Output: \n\nC to F Converter Output: \n\n" + fahrenheit;
        return "<ctofservice>" + "<celsius>" + celsius + "</celsius>" + "<ctofoutput>" + result + "</ctofoutput>" + "</ctofservice>";
    }
    
    /*
    @Path("{Buff}")
    @GET
    @Produces()
    public String StrangeExample(@PathParam("Buff") String Buff) 
    {
        int importantData =1;
        int[]  buffer = new int[10];
    
        try
        {
            for (int i =0; i < 15; i++)
                buffer[i] = 7;
        }
        catch (Exception e)
        {
            System.out.println("I caught an exception" + e.getMessage());
        }
        String result = "@Produces(\"application/xml\") Output: \n\nStrange function for Buffer Overfloe: \n\n" + Buff;
        return "<BUFF>" + "<buff>buff</celsius>" + "<b>" + result + "</b>" + "</BUFF>";
        
    //    System.out.println("after buffer overflow ");
    //    System.out.println("Important data  = "+importantData);
    }
    */
}
