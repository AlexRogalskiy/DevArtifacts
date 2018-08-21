package com.phase2technology.jenkins;

import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.export.Exported;

import hudson.EnvVars;
import hudson.model.AbstractBuild;
import hudson.model.StringParameterValue;
import hudson.util.VariableResolver;

public class RestrictedStringDynamicParameterValue extends StringParameterValue {
  private static final long serialVersionUID = 1L;
  @Exported(visibility=4)
    public final String dynamicName;
    public final String dynamicValue;

    @DataBoundConstructor
    public RestrictedStringDynamicParameterValue(String name, String value, String dynamicName, String dynamicValue) {
      this(name, value, dynamicName, dynamicValue, null);
        
    }

    public RestrictedStringDynamicParameterValue(String name, String value, String dynamicName, String dynamicValue, String description) {
        super(name, value, description);
        this.dynamicName = dynamicName;
        this.dynamicValue = dynamicValue;
    }

    /**
     * Exposes the name/value as an environment variable.
     */
    @Override
    public void buildEnvVars(AbstractBuild<?,?> build, EnvVars env) {
        env.put(name,value);
        env.put(dynamicName,dynamicValue);
    }

    @Override
    public VariableResolver<String> createVariableResolver(AbstractBuild<?, ?> build) {
        return new VariableResolver<String>() {
            public String resolve(String name) {
                return 
                  RestrictedStringDynamicParameterValue.this.name.equals(name) ? value : 
                    (RestrictedStringDynamicParameterValue.this.dynamicName.equals(name) ? dynamicValue : null);
            }
        };
    }
    

  @Override
  public int hashCode() {
    return 29 * (value.hashCode() + dynamicValue.hashCode() + name.hashCode() + dynamicName.hashCode());
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;

    if (obj instanceof RestrictedStringDynamicParameterValue) {
      RestrictedStringDynamicParameterValue other = (RestrictedStringDynamicParameterValue)obj;
      return name.equals(other.getName()) && dynamicName.equals(other.dynamicName) && value.equals(other.value) && dynamicValue.equals(other.dynamicValue);
    }

    return false;
  }

    @Override
    public String toString() {
      return "(RestrictedStringDynamicParameterValue) " + getName() + "='" + value + "', " + this.dynamicName + "='" + dynamicValue + "'";
    }

}
