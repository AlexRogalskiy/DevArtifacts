package src.hw4;
import java.util.*;

public class MergeMainFragment {
	public static SatelliteData[] generateData() {
		final int BOUND= 200;
		Random r1 = new Random();
		int size = r1.nextInt(BOUND) +1;
		SatelliteData[] randomData = new SatelliteData[size];
		System.out.println("size is " + size);
		
		for(int i=0; i < size; i++) {
			randomData[i] = new SatelliteData();
			randomData[i].longitude= r1.nextDouble()* 360.0;
			randomData[i].cloudCover= r1.nextDouble();
			randomData[i].temperature= r1.nextDouble() * 400;
		}
		Arrays.sort(randomData);
	    return randomData;	
	}

	public static void main(String[] args)  {
		final int MAX_DATASETS= 20;
		Random r1 = new Random();
		int dataSets = r1.nextInt(MAX_DATASETS) +1;
		System.out.println("Number of datasets: " + dataSets);
	}
}