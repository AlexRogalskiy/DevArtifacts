package com.mkyong;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import com.mkyong.config.AppConfig;
import com.mkyong.thread.PrintTask2;

public class App {
	public static void main(String[] args) {

		/*
		 * ApplicationContext ctx = new AnnotationConfigApplicationContext(
		 * AppConfig.class);
		 * 
		 * PrintThread printThread1 = (PrintThread) ctx.getBean("printThread");
		 * printThread1.setName("Thread 1");
		 * 
		 * PrintThread printThread2 = (PrintThread) ctx.getBean("printThread");
		 * printThread2.setName("Thread 2");
		 * 
		 * PrintThread printThread3 = (PrintThread) ctx.getBean("printThread");
		 * printThread3.setName("Thread 3");
		 * 
		 * PrintThread printThread4 = (PrintThread) ctx.getBean("printThread");
		 * printThread4.setName("Thread 4");
		 * 
		 * PrintThread printThread5 = (PrintThread) ctx.getBean("printThread");
		 * printThread5.setName("Thread 5");
		 * 
		 * printThread1.start(); printThread2.start(); printThread3.start();
		 * printThread4.start(); printThread5.start();
		 */

		/*
		ApplicationContext context = new ClassPathXmlApplicationContext(
				"Spring-Config.xml");

		ThreadPoolTaskExecutor taskExecutor = (ThreadPoolTaskExecutor) context
				.getBean("taskExecutor");
		taskExecutor.execute(new PrintTask("Thread 1"));
		taskExecutor.execute(new PrintTask("Thread 2"));
		taskExecutor.execute(new PrintTask("Thread 3"));
		taskExecutor.execute(new PrintTask("Thread 4"));
		taskExecutor.execute(new PrintTask("Thread 5"));

		// check active thread, if no then shut down the thread pool
		for (;;) {
			int count = taskExecutor.getActiveCount();
			System.out.println("Active Threads : " + count);
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			if (count == 0) {
				taskExecutor.shutdown();
				break;
			}
		}
*/
		
		ApplicationContext context = new AnnotationConfigApplicationContext(
				AppConfig.class);

		ThreadPoolTaskExecutor taskExecutor = (ThreadPoolTaskExecutor) context
				.getBean("taskExecutor");

		PrintTask2 printTask1 = (PrintTask2) context.getBean("printTask2");
		printTask1.setName("Thread 1");
		taskExecutor.execute(printTask1);

		PrintTask2 printTask2 = (PrintTask2) context.getBean("printTask2");
		printTask2.setName("Thread 2");
		taskExecutor.execute(printTask2);

		PrintTask2 printTask3 = (PrintTask2) context.getBean("printTask2");
		printTask3.setName("Thread 3");
		taskExecutor.execute(printTask3);

		for (;;) {
			int count = taskExecutor.getActiveCount();
			System.out.println("Active Threads : " + count);
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			if (count == 0) {
				taskExecutor.shutdown();
				break;
			}
		}
		 

	}
}
