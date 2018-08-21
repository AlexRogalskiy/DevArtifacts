
USE MIT1204

SELECT Name, Sales, Quota FROM SalesReps;

SELECT Name, Sales, Quota, (Sales-Quota) FROM SalesReps

SELECT Name, Sales, Quota, (Sales-Quota) FROM SalesReps WHERE Sales < Quota

SELECT AVG(Amt) FROM Orders

SELECT AVG(Amt) FROM Orders WHERE Cust = 211

INSERT INTO Offices (OfficeNbr, City, State, Region, Target, Sales, Phone) VALUES ('55', 'Dallas', 'TX', 'West', 200000, 0, '214.333.2222');

SELECT * FROM Offices

DELETE FROM Customers WHERE Company = 'Connor Co'

UPDATE Customers
SET CreditLimit = 75000 WHERE Company = 'Amaratunga Enterprises'

SELECT * FROM Customers

SELECT * FROM Offices

SELECT Region FROM Offices

SELECT DISTINCT Region FROM Offices

INSERT INTO SalesReps (RepNbr, Name, RepOffice, Sales)
VALUES ('22', 'New Rep', '57', 1000)

SELECT * FROM SalesReps

SELECT * FROM SalesReps WHERE Quota > Sales
SELECT * FROM SalesReps WHERE Quota <= Sales
SELECT * FROM SalesReps WHERE Quota IS NULL

SELECT * FROM Orders WHERE Disc*Amt > 50000;

SELECT * FROM SalesReps WHERE Quota BETWEEN 50000 AND 100000;

SELECT * FROM Offices WHERE State IN ('CO', 'UT', 'TX');

SELECT * FROM SalesReps WHERE RepNbr IS NOT NULL;

SELECT * FROM Offices WHERE Phone NOT LIKE '21%';

SELECT COUNT(*) FROM Parts WHERE Vendor = 'A'

SELECT Vendor, COUNT(*) AS PartsCount FROM Parts GROUP BY Vendor

--What is the average credit limit of customers whose credit limit is less than $1,000,000?
SELECT AVG(CreditLimit) FROM Customers WHERE CreditLimit < 1000000;

--How many sales offices are in the West region?
SELECT Count(*) FROM Offices WHERE Region= 'West';

--Increase the price of bulldozers by 30% in all orders
UPDATE Orders SET Amt= Amt*1.3 WHERE Prod= 'Bulldozer';

--Delete any sales rep with a NULL quota
DELETE FROM SalesReps WHERE Quota IS NULL;

SELECT OrderNbr, Amt, Company, CreditLimit FROM Customers, Orders WHERE Cust = CustNbr;

SELECT OrderNbr, Amt, Company, CreditLimit FROM Customers INNER JOIN Orders ON Customers.CustNbr = Orders.Cust;

SELECT OrderNbr, Amt, Company, Name FROM Orders, Customers, SalesReps WHERE Cust = CustNbr AND CustRep = RepNbr AND Amt >= 25000

SELECT OrderNbr, Amt, Company, Name FROM SalesReps 
	INNER JOIN Customers ON SalesReps.RepNbr = Customers.CustRep 
	INNER JOIN Orders ON Customers.CustNbr = Orders.Cust 
	WHERE Amt >= 25000;

SELECT * FROM Employees

--Self join
SELECT Emp.Name, Mgr.Name FROM Employees Emp, Employees Mgr WHERE Emp.Mgr = Mgr.EmpNbr
SELECT Emp.Name AS EmpName, Mgr.Name AS MgrName FROM Employees AS Emp INNER JOIN Employees AS Mgr ON Emp.Mgr = Mgr.EmpNbr 


--Subquery example
SELECT City FROM Offices WHERE Target >
(SELECT SUM(Quota) FROM SalesReps WHERE RepOffice = OfficeNbr);

CREATE VIEW CustomerOrders AS 
SELECT CustNbr, Company, Name, OrderNbr, Prod, Qty, Amt 
FROM Customers, SalesReps, Orders 
WHERE CustRep = RepNbr AND CustNbr = Cust 

--List customer names whose credit limit is greater than their sales rep’s quota. Also list the credit limit and quota
SELECT CreditLimit, Quota, Company FROM SalesReps INNER JOIN Customers ON SalesReps.RepNbr = Customers.CustRep WHERE CreditLimit>Quota;

--List each rep’s name and phone number
SELECT Name, Phone FROM Offices INNER JOIN SalesReps ON Offices.OfficeNbr = SalesReps.RepOffice


-- Display all customers with orders > 50000 or credit limit > 50000
SELECT DISTINCT CustNbr FROM Customers LEFT JOIN Orders ON CustNbr = Cust
	WHERE (CreditLimit > 50000 OR Amt > 50000);

-- Delete reps in sales offices in NY with quotas > 40000

DELETE FROM SalesReps WHERE RepNbr IN  
(SELECT RepNbr FROM SalesReps, Offices WHERE OfficeNbr = RepOffice AND Quota>40000 AND State='NY');
