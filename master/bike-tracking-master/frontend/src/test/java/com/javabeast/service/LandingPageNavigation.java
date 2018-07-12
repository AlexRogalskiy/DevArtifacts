package com.javabeast.service;

import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

// navigation link tests. verification that buttons are linking to correct URL. 
public class LandingPageNavigation {

    private WebDriver driver = new ChromeDriver();

    private String URL = "https://localhost:8443/";
//    private String URL = "https://bike-tracker.com/"

    private void getHome() throws InterruptedException {
        driver.get(URL);
        Thread.sleep(1000);
        driver.manage().window().maximize();
    }

    // faq navigation - top nav bar  
    @Test
    public void callFAQNav() throws InterruptedException {
        getHome();
        driver.findElement(By.linkText("FAQ")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "faq");
        driver.quit();
    }

    // features navigation - top nav bar 
    @Test
    public void callFeaturesNav() throws InterruptedException {
        getHome();
        driver.findElement(By.linkText("Features")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "#features");
        driver.quit();
    }

    // pricing navigation - top nav bar 
    @Test
    public void callPricingNav() throws InterruptedException {
        getHome();
        driver.findElement(By.linkText("Pricing")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "#pricing");
        driver.quit();
    }

    // buy navigation - top nav bar 
    @Test
    public void callBuyNav() throws InterruptedException {
        getHome();
        driver.findElement(By.linkText("Buy")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "checkout");
        driver.quit();
    }

    // login navigation - top nav bar 
    @Test
    public void callLoginNav() throws InterruptedException {
        getHome();
        driver.findElement(By.linkText("Login")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "login");
        driver.quit();
    }

    // pricing 9.99/mo buy navigation 
    @Test
    public void callBuy1() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//*[@id=\"start-now-starter\"]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "checkout?plan=monthly");
        driver.quit();
    }

    // pricing 99.99/year buy navigation 
    @Test
    public void callBuy2() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//*[@id=\"start-now-plus\"]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "checkout?plan=annual1");
        driver.quit();
    }

    // pricing 269.00/3 year buy navigation 
    @Test
    public void callBuy3() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//*[@id=\"start-now-premium\"]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "checkout?plan=annual2");
        driver.quit();
    }

    // english language dropdown
    @Test
    public void enLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[1]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=en");
        driver.quit();
    }

    // deutsch language dropdown
    @Test
    public void deLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[2]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=de");
        driver.quit();
    }

    // espanol language dropdown 
    @Test
    public void esLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[3]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=es");
        driver.quit();
    }

    // italiano language dropdown 
    @Test
    public void itLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[4]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=it");
        driver.quit();
    }

    // nederlands language dropdown 
    @Test
    public void nlLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[5]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=nl");
        driver.quit();
    }

    // polskie language dropdown 
    @Test
    public void plLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[6]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=pl");
        driver.quit();
    }

    // portugues language dropdown 
    @Test
    public void ptLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[7]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=pt");
        driver.quit();
    }

    // dansk language dropdown 
    @Test
    public void daLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[8]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=da");
        driver.quit();
    }

    // russian language dropdown 
    @Test
    public void ruLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[9]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=ru");
        driver.quit();
    }

    // ukraine language dropdown 
    @Test
    public void ukLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[10]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=uk");
        driver.quit();
    }

    // norsk language dropdown 
    @Test
    public void noLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[11]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=no");
        driver.quit();
    }

    // svenska language dropdown
    @Test
    public void svLangCheck() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[1]/nav/div/ul[1]/li[5]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("//*[@id=\"dropdown1\"]/li[12]")).click();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "?lang=sv");
        driver.quit();
    }

    // terms and conditions 
    @Test
    public void termsNavigation() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("//html/body/div[3]/footer/div[2]/div/a[2]")).click();
        Thread.sleep(1000);
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "terms");
        driver.quit();
    }

    // login navigation 
    @Test
    public void loginNav() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("/html/body/div[1]/nav/div/ul[1]/li[6]/a")).click();
        Thread.sleep(1000);
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "login");
        driver.quit();
    }

    // login using the login page 
    @Test
    public void loginLogin() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("/html/body/div[1]/nav/div/ul[1]/li[6]/a")).click();
        Thread.sleep(1000);
        String currentUrl = driver.getCurrentUrl();
        driver.findElement(By.xpath("/html/body/form/div[1]/label/input")).sendKeys("user");
        driver.findElement(By.xpath("/html/body/form/div[2]/label/input")).sendKeys("password");
        driver.findElement(By.xpath("/html/body/form/div[3]/input")).submit();
        Assert.assertEquals(URL += "dashboard", currentUrl);
        driver.quit();
    }

    // login using the login page with incorrect credentials
    @Test
    public void loginLoginError() throws InterruptedException {
        getHome();
        driver.findElement(By.xpath("/html/body/div[1]/nav/div/ul[1]/li[6]/a")).click();
        Thread.sleep(1000);
        driver.findElement(By.xpath("/html/body/form/div[1]/label/input")).sendKeys("incorrect");
        driver.findElement(By.xpath("/html/body/form/div[2]/label/input")).sendKeys("credentials");
        driver.findElement(By.xpath("/html/body/form/div[3]/input")).submit();
        String currentUrl = driver.getCurrentUrl();
        Assert.assertEquals(currentUrl, URL += "login?error");
        driver.quit();
    }
}
