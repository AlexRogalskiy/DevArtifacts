//Hierarchical Linear Regression Example
//created by John M. Quick
//http://www.johnmquick.com
//December 13, 2009

> #read data into variable
> datavar <- read.csv("dataset_enrollmentForecast.csv")

> #attach data variable
> attach(datavar)

> #display all data
> datavar
   YEAR  ROLL UNEM HGRAD  INC
1     1  5501  8.1  9552 1923
2     2  5945  7.0  9680 1961
3     3  6629  7.3  9731 1979
4     4  7556  7.5 11666 2030
5     5  8716  7.0 14675 2112
6     6  9369  6.4 15265 2192
7     7  9920  6.5 15484 2235
8     8 10167  6.4 15723 2351
9     9 11084  6.3 16501 2411
10   10 12504  7.7 16890 2475
11   11 13746  8.2 17203 2524
12   12 13656  7.5 17707 2674
13   13 13850  7.4 18108 2833
14   14 14145  8.2 18266 2863
15   15 14888 10.1 19308 2839
16   16 14991  9.2 18224 2898
17   17 14836  7.7 18997 3123
18   18 14478  5.7 19505 3195
19   19 14539  6.5 19800 3239
20   20 14395  7.5 19546 3129
21   21 14599  7.3 19117 3100
22   22 14969  9.2 18774 3008
23   23 15107 10.1 17813 2983
24   24 14831  7.5 17304 3069
25   25 15081  8.8 16756 3151
26   26 15127  9.1 16749 3127
27   27 15856  8.8 16925 3179
28   28 15938  7.8 17231 3207
29   29 16081  7.0 16816 3345

> #create three linear models using lm(FORMULA, DATAVAR)
> #one predictor model
> onePredictorModel <- lm(ROLL ~ UNEM, datavar)
> #two predictor model
> twoPredictorModel <- lm(ROLL ~ UNEM + HGRAD, datavar)
> #three predictor model
> threePredictorModel <- lm(ROLL ~ UNEM + HGRAD + INC, datavar)

> #get summary data for each model using summary(OBJECT)
> summary(onePredictorModel)

Call:
lm(formula = ROLL ~ UNEM, data = datavar)

Residuals:
    Min      1Q  Median      3Q     Max 
-7640.0 -1046.5   602.8  1934.3  4187.2 

Coefficients:
            Estimate Std. Error t value Pr(>|t|)  
(Intercept)   3957.0     4000.1   0.989   0.3313  
UNEM          1133.8      513.1   2.210   0.0358 *
---
Signif. codes:  0 Ô***Õ 0.001 Ô**Õ 0.01 Ô*Õ 0.05 Ô.Õ 0.1 Ô Õ 1 

Residual standard error: 3049 on 27 degrees of freedom
Multiple R-squared: 0.1531,	Adjusted R-squared: 0.1218 
F-statistic: 4.883 on 1 and 27 DF,  p-value: 0.03579 

> summary(twoPredictorModel)

Call:
lm(formula = ROLL ~ UNEM + HGRAD, data = datavar)

Residuals:
    Min      1Q  Median      3Q     Max 
-2102.2  -861.6  -349.4   374.5  3603.5 

Coefficients:
              Estimate Std. Error t value Pr(>|t|)    
(Intercept) -8.256e+03  2.052e+03  -4.023  0.00044 ***
UNEM         6.983e+02  2.244e+02   3.111  0.00449 ** 
HGRAD        9.423e-01  8.613e-02  10.941 3.16e-11 ***
---
Signif. codes:  0 Ô***Õ 0.001 Ô**Õ 0.01 Ô*Õ 0.05 Ô.Õ 0.1 Ô Õ 1 

Residual standard error: 1313 on 26 degrees of freedom
Multiple R-squared: 0.8489,	Adjusted R-squared: 0.8373 
F-statistic: 73.03 on 2 and 26 DF,  p-value: 2.144e-11 

> summary(threePredictorModel)

Call:
lm(formula = ROLL ~ UNEM + HGRAD + INC, data = datavar)

Residuals:
      Min        1Q    Median        3Q       Max 
-1148.840  -489.712    -1.876   387.400  1425.753 

Coefficients:
              Estimate Std. Error t value Pr(>|t|)    
(Intercept) -9.153e+03  1.053e+03  -8.691 5.02e-09 ***
UNEM         4.501e+02  1.182e+02   3.809 0.000807 ***
HGRAD        4.065e-01  7.602e-02   5.347 1.52e-05 ***
INC          4.275e+00  4.947e-01   8.642 5.59e-09 ***
---
Signif. codes:  0 Ô***Õ 0.001 Ô**Õ 0.01 Ô*Õ 0.05 Ô.Õ 0.1 Ô Õ 1 

Residual standard error: 670.4 on 25 degrees of freedom
Multiple R-squared: 0.9621,	Adjusted R-squared: 0.9576 
F-statistic: 211.5 on 3 and 25 DF,  p-value: < 2.2e-16 

> #compare successive models using anova(MODEL1, MODEL2, MODELi)
> anova(onePredictorModel, twoPredictorModel, threePredictorModel)
Analysis of Variance Table

Model 1: ROLL ~ UNEM
Model 2: ROLL ~ UNEM + HGRAD
Model 3: ROLL ~ UNEM + HGRAD + INC
  Res.Df       RSS Df Sum of Sq      F    Pr(>F)    
1     27 251084710                                  
2     26  44805568  1 206279143 458.92 < 2.2e-16 ***
3     25  11237313  1  33568255  74.68 5.594e-09 ***
---
Signif. codes:  0 Ô***Õ 0.001 Ô**Õ 0.01 Ô*Õ 0.05 Ô.Õ 0.1 Ô Õ 1 