public class TrackPopulation2 {

    public static void main(String args[]) {
        int smackoverARpop = 2232;
      
        smackoverARpop = birth(smackoverARpop);      
        System.out.println(smackoverARpop);
    }   
   
    static int birth(int cityPop) {
        return cityPop + 1;
    }
}
