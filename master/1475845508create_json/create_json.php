<?php

/**
* Пример создание json БД,
* создается таблица employee в БД json    
*/
class JsonBuilder 
{
	
	private $mysql = null;  
	private $dep_no = [];
	private $titles = [];
	private $salary = [];
	private $dept_emp = [];


	private function connect($host, $user, $password) {
		$this->mysql = new mysqli($host,$user,$password,'employees');		
	}


	private function getDepatraments() {

		$res = $this->mysql->query('SELECT * FROM departments');
		if (!$res) {
			echo $this->mysql->error, PHP_EOL;
			exit;
		}

		while( $row = $res->fetch_assoc() ) {
			$this->dep_no[$row['dept_no']] = $row['dept_name'];
		}

		$res->free_result();
	}


	private function getTitles() {
		$res = $this->mysql->query('SELECT * FROM titles');
		if (!$res) {
			echo $this->mysql->error, PHP_EOL;
			exit;
		}

		while( $row = $res->fetch_assoc() ) {
			if (!isset($this->titles[$row['emp_no']])) {
				$this->titles[$row['emp_no']] = [];
			}
			$no = (int)$row['emp_no'];
			unset($row['emp_no']);
			$this->titles[$no][] = $row;
		}

		$res->free_result();
	}


	private function getSalaries() {

		$res = $this->mysql->query('SELECT * FROM salaries');
		if (!$res) {
			echo $this->mysql->error, PHP_EOL;
			exit;
		}

		while( $row = $res->fetch_assoc() ) {
			if (!isset($this->salary[$row['emp_no']])) {
				$this->salary[$row['emp_no']] = [];
			}
			$no = (int)$row['emp_no'];
			unset($row['emp_no']);
			$this->salary[$no][] = $row;
		}

		$res->free_result();
	}


	private function getDepEmployee() {

		$res = $this->mysql->query('SELECT * FROM dept_emp');
		if (!$res) {
			echo $this->mysql->error, PHP_EOL;
			exit;
		}

		
		while( $row = $res->fetch_assoc() ) {
			if (!isset($this->dept_emp[$row['emp_no']])) {
				$this->dept_emp[$row['emp_no']] = [];
			}
			$no = (int)$row['emp_no'];
			unset($row['emp_no']);

			if (isset($this->dep_no[$row['dept_no']])) {
				$row['title'] = $this->dep_no[$row['dept_no']];
			}
			$this->dept_emp[$no][] = $row;
		}

		$res->free_result();
	}


	private function createJsonEmployee() {

		$res = $this->mysql->query('SELECT * FROM employees');
		if (!$res) {
			echo $this->mysql->error, PHP_EOL;
			exit;
		}

		$sql = 'INSERT INTO  json.employees(emp_no, data) VALUES ';

		$sql_values = '';
		$count = 100;


		while( $row = $res->fetch_assoc() ) {
			$no = (int)$row['emp_no'];
			
			if (isset($this->salary[$no]))
				$row['salary'] = $this->salary[$no];

			if(isset($this->titles[$no])){
				$row['titles'] = $this->titles[$no];
			}

			if(isset($this->dept_emp[$no])){
				$row['departament'] = $this->dept_emp[$no];
			}

			unset($row['emp_no']);
			$sql_values .= sprintf(',(%d, \'%s\')', $no, json_encode($row) );

			if (!(--$count)) {
				$sql_values[0] = ' ';
		//        echo $sql . $sql_values,PHP_EOL;
				$time = microtime(true);
				$this->mysql->query($sql . $sql_values);
				echo 'affected ',$this->mysql->affected_rows,'  time: ' ,( microtime(true) - $time ),  PHP_EOL;
				$count = 100;
				$sql_values = '';
			}

		}
			if (strlen($sql_values)) {
				$sql_values[0] = ' ';
				$this->mysql->query($sql . $sql_values);
				echo 'affected ',$this->mysql->affected_rows, PHP_EOL;
			}
	
	}


	public function clearTable($host, $user, $password) {

		$this->connect($host, $user, $password);


		$res = $this->mysql->query('TRUNCATE TABLE json.employees');
		if (!$res) {
			echo $this->mysql->error, PHP_EOL;
			exit;
		}

	}

	public function run($host, $user, $password) {

		$this->connect($host, $user, $password);

		$this->getDepatraments();

		$this->getTitles();

		$this->getSalaries();
		
		$this->getDepEmployee();

		$this->createJsonEmployee();

		echo 'Ok', PHP_EOL;
	}

}

$host = 'localhost';
$user = 'guest';
$password = 'my password'
(new JsonBuilder())->run($host, $user, $password);

