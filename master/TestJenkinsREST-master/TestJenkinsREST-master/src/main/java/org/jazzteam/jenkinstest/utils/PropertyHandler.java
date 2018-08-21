package org.jazzteam.jenkinstest.utils;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.PropertiesConfiguration;
import org.apache.log4j.Logger;

public class PropertyHandler {
    private static final Logger LOG = Logger.getLogger(PropertyHandler.class);

    public static String getProperty(String query) {
        String systemRegisteredProperty = (String) System.getProperties().get(query);
        if(systemRegisteredProperty == null) {
            return getConfigurationProperty(query);
        }
        return systemRegisteredProperty;
    }

    public static String getConfigurationProperty(String query){
        String value;
        try {
            PropertiesConfiguration property = new PropertiesConfiguration("src/main/resources/configuration.properties");
            PropertiesConfiguration propertyInterpolated = (PropertiesConfiguration) property.interpolatedConfiguration();
            if(propertyInterpolated.getProperty(query) != null) {
                value = propertyInterpolated.getProperty(query).toString();
            }else{
                throw new RuntimeException(query + " property not found in configuration.properties");
            }
        }catch (ConfigurationException e) {
            LOG.error(e);
            throw new RuntimeException("ConfigurationException in DriverPropertyHandler.class");
        }
        return value;
    }
}
