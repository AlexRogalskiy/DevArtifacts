

import org.junit.Test;
import static org.junit.Assert.assertEquals;

import com.simplesciences.MathHelper;

public class mathHelperTest {
    @Test
    public void AddTest()
    {
        MathHelper mc=new MathHelper();
        assertEquals(mc.add(4,5),9);
        assertEquals(mc.add(0,5),5);
        assertEquals(mc.add(100,100),200);
        assertEquals(mc.add(1000,1000),2000);
        assertEquals(mc.add(10000,10000),20000);
    }

    @Test
    public void AddNegativeNumbersTest()
    {
        MathHelper mc=new MathHelper();
        assertEquals(mc.add(-4,5),1);
        assertEquals(mc.add(0,-5),-5);
        assertEquals(mc.add(-1,-2),-3);
        assertEquals(mc.add(-1,1),0);
         assertEquals(mc.add(-2,2),0);
    }

    @Test
    public void AddNZeroesTest()
    {
        MathHelper mc=new MathHelper();
        assertEquals(mc.add(-4,0),-4);
        assertEquals(mc.add(0,-15),-15);
        assertEquals(mc.add(0,-2),-2);
        assertEquals(mc.add(0,0),0);
    }

    @Test
    public void AddDoubleTest()
    {
        MathHelper mc=new MathHelper();
        assertEquals(mc.add(-4.5,0),-4.5,0.1);
        assertEquals(mc.add(0,-1.5),-1.5,0.1);
    }

    @Test
    public void AddDouble2Test()
    {
        MathHelper mc=new MathHelper();
        assertEquals(mc.add(-4.5,1.5),-3.0,0.1);
        assertEquals(mc.add(-0.70,-1.5),-2.20,0.1);
    }
}
