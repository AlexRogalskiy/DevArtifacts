package com.javainuse;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;

import com.javainuse.model.Employee;
import com.javainuse.service.EmployeeService;

@SpringBootApplication
@EnableCaching
public class SpringBootJdbcApplication {
	
	@Autowired
	EmployeeService employeeService;

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(SpringBootJdbcApplication.class, args);
		EmployeeService employeeService = context.getBean(EmployeeService.class);
		
		
		Employee emp= new Employee();
		emp.setEmpId("emp");
		emp.setEmpName("emp");
		
		Employee emp1= new Employee();
		emp1.setEmpId("emp1");
		emp1.setEmpName("emp1");
		
		Employee emp2= new Employee();
		emp2.setEmpId("emp2");
		emp2.setEmpName("emp2");

		
		employeeService.insertEmployee(emp);

		List<Employee> employees = new ArrayList<>();
		employees.add(emp1);
		employees.add(emp2);
		employeeService.insertEmployees(employees);
		
		
		
		System.out.println("Inside the main class making call to service first time");
		List<Employee> employeeList1 = employeeService.getAllEmployees();
		for (Employee employee : employeeList1) {
			System.out.println(employee.toString());
		}
		
		
		System.out.println("Inside the main class making call to service second time where it will use hazelcast");
		List<Employee> employeeList2 = employeeService.getAllEmployees();
		for (Employee employee : employeeList2) {
			System.out.println(employee.toString());
		}
		

	}
}