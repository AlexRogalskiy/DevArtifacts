<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>User Registration Form</title>

<style>

	.error {
		color: #ff0000;
	}
</style>

</head>

<body>

	<h2>User Registration Form</h2>
 
	<form:form method="POST" modelAttribute="user">
		
		<table>
			<tr>
				<td><label for="id">ID: </label> </td>
				<td><form:input path="id" id="id"/></td>
		    </tr>
			<tr>
				<td><label for="firstName">First Name: </label> </td>
				<td><form:input path="firstName" id="firstName"/></td>
		    </tr>
			<tr>
				<td><label for="lastName">Last Name: </label> </td>
				<td><form:input path="lastName" id="lastName"/></td>
		    </tr>
	    
			<tr>
				<td><label for="type">Type: </label> </td>
				<td><form:input path="type" id="type"/></td>
		    </tr>
			<tr>
				<td colspan="3">
					<c:choose>
						<c:when test="${edit}">
							<input type="submit" value="Update"/>
						</c:when>
						<c:otherwise>
							<input type="submit" value="Register"/>
						</c:otherwise>
					</c:choose>
				</td>
			</tr>
		</table>
	</form:form>
	<br/>
	<br/>
	Go back to <a href="<c:url value='/list' />">List of All Users</a>
	<a href="<c:url value='/logout' />">Logout</a>
</body>
</html>