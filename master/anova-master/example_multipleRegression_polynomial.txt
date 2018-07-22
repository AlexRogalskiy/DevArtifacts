//Polynomial Modelling Example
//created by John M. Quick
//http://www.johnmquick.com
//January 13, 2010

> #read data into variable
> datavar <- read.csv("dataset_practiceFinal.csv")

> #attach data variable
> attach(datavar)

> #display all data
> datavar
   Practice Final
1        55    50
2        55    60
3        65    75
4        65    55
5        70    65
6        75    70
7        50    40
8        50    50
9        50    55
10       55    60
11       75    80
12       55    60
13       70    60
14       55    65
15       60    70
16       85    95
17       70    70
18       75    75
19       80    85
20       75    75
21       75    75
22       70    75
23       75    80
24       80    85
25       80    85
26       85    90
27       95    90
28       90    95
29       85    90
30       90    90
31       75    80
32       80    85
33       90    90
34       90    95
35       80    90
36       95    95
37       80    90
38       90    80
39       85    90
40       85    95

> #create a scatterplot to visualize the data
> plot(Practice, Final, xlim = c(40, 100), ylim = c(40, 100), main = "Final Exam Score on Practice Exam Score", xlab = "Practice Exam Score", ylab = "Final Exam Score")

> #center the dependent variable
> FinalC <- Final - mean(Final)
> #center the predictor
> PracticeC <- Practice - mean(Practice)

> #create the quadratic variable
> PracticeC2 <- PracticeC * PracticeC
> #create the cubic variable
> PracticeC3 <- PracticeC * PracticeC * PracticeC

> #create the models using lm(FORMULA, DATAVAR)
> #linear model
> linearModel <- lm(FinalC ~ PracticeC, datavar)
> #quadratic model
> quadraticModel <- lm(FinalC ~ PracticeC + PracticeC2, datavar)
> #cubic model
> cubicModel <- lm(FinalC ~ PracticeC + PracticeC2 + PracticeC3, datavar)

> #display summary information about the models
> summary(linearModel)

Call:
lm(formula = FinalC ~ PracticeC, data = datavar)

Residuals:
    Min      1Q  Median      3Q     Max 
-12.736  -2.736   2.377   3.060   8.060 

Coefficients:
              Estimate Std. Error   t value Pr(>|t|)    
(Intercept) -1.711e-15  9.583e-01 -1.79e-15        1    
PracticeC    1.023e+00  7.273e-02     14.06   <2e-16 ***
---
Signif. codes:  0 Ô***Õ 0.001 Ô**Õ 0.01 Ô*Õ 0.05 Ô.Õ 0.1 Ô Õ 1 

Residual standard error: 6.061 on 38 degrees of freedom
Multiple R-squared: 0.8388,	Adjusted R-squared: 0.8346 
F-statistic: 197.8 on 1 and 38 DF,  p-value: < 2.2e-16 

> summary(quadraticModel)

Call:
lm(formula = FinalC ~ PracticeC + PracticeC2, data = datavar)

Residuals:
    Min      1Q  Median      3Q     Max 
-13.247  -3.308   1.827   3.567   8.567 

Coefficients:
             Estimate Std. Error t value Pr(>|t|)    
(Intercept)  0.942143   1.381569   0.682    0.500    
PracticeC    0.994740   0.078600  12.656 5.19e-15 ***
PracticeC2  -0.005427   0.005725  -0.948    0.349    
---
Signif. codes:  0 Ô***Õ 0.001 Ô**Õ 0.01 Ô*Õ 0.05 Ô.Õ 0.1 Ô Õ 1 

Residual standard error: 6.069 on 37 degrees of freedom
Multiple R-squared: 0.8426,	Adjusted R-squared: 0.8341 
F-statistic: 99.07 on 2 and 37 DF,  p-value: 1.388e-15 

> summary(cubicModel)

Call:
lm(formula = FinalC ~ PracticeC + PracticeC2 + PracticeC3, data = datavar)

Residuals:
    Min      1Q  Median      3Q     Max 
-12.363  -3.210   1.224   3.381   9.664 

Coefficients:
              Estimate Std. Error t value Pr(>|t|)    
(Intercept)  0.8617698  1.3715615   0.628    0.534    
PracticeC    1.2189285  0.1925374   6.331 2.52e-07 ***
PracticeC2  -0.0083796  0.0061331  -1.366    0.180    
PracticeC3  -0.0006613  0.0005193  -1.273    0.211    
---
Signif. codes:  0 Ô***Õ 0.001 Ô**Õ 0.01 Ô*Õ 0.05 Ô.Õ 0.1 Ô Õ 1 

Residual standard error: 6.018 on 36 degrees of freedom
Multiple R-squared: 0.8494,	Adjusted R-squared: 0.8369 
F-statistic:  67.7 on 3 and 36 DF,  p-value: 7.16e-15 

> #compare the models using ANOVA
> anova(linearModel, quadraticModel, cubicModel)
Analysis of Variance Table

Model 1: FinalC ~ PracticeC
Model 2: FinalC ~ PracticeC + PracticeC2
Model 3: FinalC ~ PracticeC + PracticeC2 + PracticeC3
  Res.Df    RSS Df Sum of Sq      F Pr(>F)
1     38 1395.8                           
2     37 1362.7  1    33.088 0.9135 0.3456
3     36 1304.0  1    58.735 1.6216 0.2110
