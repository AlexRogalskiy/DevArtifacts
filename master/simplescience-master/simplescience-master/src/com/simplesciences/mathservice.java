package com.simplesciences;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;


@Path("/")
public class mathservice {
    @GET
    @Path("/add/{a}/{b}")
    @Produces("application/json")
    public String add(@PathParam("a") Double a, @PathParam("b") Double b) {
        MathHelper mh=new MathHelper();
        String ans= "1*" + mh.add(a,b);
       // String result = "@Produces(\"application/json\") Output: \n\nadding two numbers: \n\n" + ans;
        return "{\"" + a + "+" + b + "\" : " + ans + " }";
    }

    @GET
    @Path("/subtract/{a}/{b}")
    @Produces("application/json")
    public String subtract(@PathParam("a") Double a, @PathParam("b") Double b) {
        MathHelper mh=new MathHelper();
        String ans= "" + mh.subtract(a,b);
        // String result = "@Produces(\"application/json\") Output: \n\nadding two numbers: \n\n" + ans;
        return "{\"" + a + "-" + b + "\" : " + ans + " }";
    }
/*
    @GET
    @Path("/subtract/{a}/{b}")
    @Produces("application/json")
    public String subtract(@PathParam("a") int a, @PathParam("b") int b) {
        MathHelper mh=new MathHelper();
        String ans= "" + mh.subtract(a,b);
        // String result = "@Produces(\"application/json\") Output: \n\nadding two numbers: \n\n" + ans;
        return "{\"" + a + "-" + b + "\" : " + ans + " }";
    }

    @GET
    @Path("/subtract/{a}/{b}")
    @Produces("application/json")
    public String subtract(@PathParam("a") float a, @PathParam("b") float b) {
        MathHelper mh=new MathHelper();
        String ans= "" + mh.subtract(a,b);
        // String result = "@Produces(\"application/json\") Output: \n\nadding two numbers: \n\n" + ans;
        return "{\"" + a + "-" + b + "\" : " + ans + " }";
    }
    */
}