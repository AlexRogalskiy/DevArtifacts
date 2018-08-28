package ru.javabean.minimalg

import groovyx.net.http.RESTClient
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter


@Configuration
@ComponentScan
@EnableAutoConfiguration
@RestController
@RequestMapping("/api/v1")
class Application extends WebMvcConfigurerAdapter {

    @RequestMapping("/city/{name}")
    Map yo(@PathVariable name) {
        def locationApi = new RESTClient('http://maps.googleapis.com/maps/api/geocode/')

        def queryString = "json"
        def response = locationApi.get(path: queryString,
                query: [address: name, sensor: 'true'])
        def lat = response.data.results.geometry.location[0].lat
        def lon = response.data.results.geometry.location[0].lng

        def cityApi = new RESTClient('https://api.forecast.io/')
        def str = "forecast/a0dad77c4f7b382e7d2514b9bae7acdb/$lat,$lon"

        def resp = cityApi.get(path: str,
                query: [units: 'si'])

        [address: response.data.results.formatted_address[0], latitude: lat, longitude: lon, icon: resp.data.currently.icon,
         temp   : resp.data.currently.temperature]
    }

    static void main(String[] args) {
        SpringApplication.run Application, args
    }
}
