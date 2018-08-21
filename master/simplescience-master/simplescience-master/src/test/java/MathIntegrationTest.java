import org.junit.Test;
import static org.junit.Assert.assertEquals;

import com.simplesciences.MathHelper;

public class MathIntegrationTest {

    @Test
    public void AddTest()
    {
        MathHelper mc1=new MathHelper();
        assertEquals(mc1.add(4,5),9);
        assertEquals(mc1.add(10,5),15);
        assertEquals(mc1.add(100,100),200);
        assertEquals(mc1.add(200,100),300);
    }

    @Test
    public void AddNegativeNumbersTest()
    {
        MathHelper mc2=new MathHelper();
        assertEquals(mc2.add(-4,4),0);
        assertEquals(mc2.add(0,-5),-5);
    }

    @Test
    public void AddNegativeNumbersTest2()
    {
        MathHelper mc2=new MathHelper();
        assertEquals(mc2.add(-4,-5),-9);
        assertEquals(mc2.add(45,-5),40);
    }
    @Test
    public void AddNZeroesTest()
    {
        MathHelper mc3=new MathHelper();
        assertEquals(mc3.add(-4,0),-4);
        assertEquals(mc3.add(1,-15),-14);
    }

    @Test
    public void AddFloatTest()
    {
        MathHelper mc3=new MathHelper();
        assertEquals(mc3.add(1.5,2.3),3.8,0.01);
        assertEquals(mc3.add(2.25,-1.35),0.90,0.01);
        assertEquals(mc3.add(3.25,-1.35),1.90,0.01);
    }
}
