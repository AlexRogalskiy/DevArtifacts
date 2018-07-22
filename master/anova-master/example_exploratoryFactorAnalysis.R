####################################
#Exploratory Factor Analysis Example
#Created by John M. Quick
#http://www.johnmquick.com
#October 23, 2011
####################################

#read the dataset into R variable using the read.csv(file) function
data <- read.csv("dataset_EFA.csv")

#display the data (warning: large output)
data

#install the package (if necessary)
install.packages("psych")

#load the package (if necessary)
library(psych)

#calculate the correlation matrix
corMat  <- cor(data)

#display the correlation matrix
corMat

#use fa() to conduct an oblique principal-axis exploratory factor analysis
#save the solution to an R variable
solution <- fa(r = corMat, nfactors = 2, rotate = "oblimin", fm = "pa")

#display the solution output
solution