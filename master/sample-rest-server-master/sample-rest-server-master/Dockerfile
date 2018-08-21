FROM 		openjdk:8-jre-alpine
MAINTAINER 	Craig Vitter <https://github.com/cvitter/>

COPY 		./target/sample-rest-server-*-jar-with-dependencies.jar /app/sample-rest-server.jar
EXPOSE 		4567

CMD ["java","-jar","/app/sample-rest-server.jar"]