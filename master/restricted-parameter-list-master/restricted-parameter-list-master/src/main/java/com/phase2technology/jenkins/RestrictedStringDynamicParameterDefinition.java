package com.phase2technology.jenkins;

import hudson.Extension;
import net.sf.json.JSONObject;

import org.kohsuke.stapler.QueryParameter;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;

import hudson.model.Hudson;
import hudson.model.Job;
import hudson.model.ParameterDefinition;
import hudson.model.ParameterValue;
import hudson.model.ParametersDefinitionProperty;
import hudson.model.StringParameterValue;
import hudson.util.ListBoxModel;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.logging.Logger;

/**
 * String based parameter that supports picking the string from two lists of values
 * presented at build time generated from commands specified in job configuration
 * for this parameter and organized such that the command for the second list sees
 * the value from the first list and can change allowed values dynamically
 * 
 * @author Chris Johnson 
 * @see {@link ParameterDefinition}
 */
public class RestrictedStringDynamicParameterDefinition extends RestrictedStringParameterDefinition {
  private static final Logger LOG = Logger.getLogger(RestrictedStringDynamicParameterDefinition.class.getName());
  static final long serialVersionUID = 1;
  public final String dynamicName;
  public final String dynamicCommand;
    
  public RestrictedStringDynamicParameterDefinition(String name, String command, String dynamicName, String dynamicCommand) {
    super(name, command);
    this.dynamicName = dynamicName;
    this.dynamicCommand = dynamicCommand;
  }

  @DataBoundConstructor
  public RestrictedStringDynamicParameterDefinition(String name, String command,  String dynamicName, String dynamicCommand, String description) {
    super(name, command, description);
    this.dynamicName = dynamicName;
    this.dynamicCommand = dynamicCommand;
  }

  @Extension
  public static final class DescriptorImpl extends ParameterDescriptor {
    private RestrictedStringDynamicParameterDefinition getDynamicParameter(String paramname) {
      String containsJobName = getCurrentDescriptorByNameUrl();
      String jobName = null;
      try {
        jobName = java.net.URLDecoder.decode(containsJobName.substring(containsJobName.lastIndexOf("/") + 1), "UTF-8");
      } catch (UnsupportedEncodingException e) {
        LOG.warning("Could not find parameter definition instance for parameter " + paramname + " due to encoding error in job name: " + e.getMessage());
        return null;
      }
      
      Job<?,?> j = Hudson.getInstance().getItemByFullName(jobName, hudson.model.Job.class);
      if (j != null) {
        ParametersDefinitionProperty pdp = j.getProperty(hudson.model.ParametersDefinitionProperty.class);
        List<ParameterDefinition> pds = pdp.getParameterDefinitions();
        for (ParameterDefinition pd : pds) {
          if (this.isInstance(pd) && ((RestrictedStringDynamicParameterDefinition) pd).getName().equalsIgnoreCase(paramname)) {
            return (RestrictedStringDynamicParameterDefinition) pd;
          }
        }
      }
      LOG.warning("Could not find parameter definition instance for parameter " + paramname);
      return null;
    }
    
    @Override
    public String getDisplayName() {
      return "Restricted String Dynamic Parameter";
    }
    
    public ListBoxModel doFillValueItems(@QueryParameter String name) {
      ListBoxModel m = new ListBoxModel();

      RestrictedStringDynamicParameterDefinition dp = this.getDynamicParameter(name);

      if (dp != null) {
        try {
          for (String s : dp.getAllowedValues(dp.command, "")) {
            m.add(s);
          }
        }
        catch (IOException e) {
          LOG.warning(e.getMessage());
        }
      }
      return m;
    }
    
    public ListBoxModel doFillDynamicValueItems(@QueryParameter String name, @QueryParameter String value) {
      ListBoxModel m = new ListBoxModel();

      RestrictedStringDynamicParameterDefinition dp = this.getDynamicParameter(name);
      try {
        if (dp != null) {
          for (String s : dp.getAllowedValues(dp.dynamicCommand, value)) {
            m.add(s);
          }
        }
      }
      catch (IOException e) {
        LOG.warning(e.getMessage());
      }
      return m;
    }
  }

  /*
   * Ensure that the data received for requesting a build hasn't been tampered with
   * and still represents an allowed parameter value
   */
  private ParameterValue checkValue(RestrictedStringDynamicParameterValue value) {
    try {
      if (!getAllowedValues(this.command, "").contains(value.value))
        throw new IllegalArgumentException("Illegal choice: " + value.value);
      if (!getAllowedValues(this.dynamicCommand, value.value).contains(value.dynamicValue))
        throw new IllegalArgumentException("Illegal choice: " + value.dynamicValue);
    }
    catch (IOException e) {
      throw new IllegalArgumentException("Could not validate value");
    }
    return value;
  }

  @Override
  public ParameterValue createValue(StaplerRequest req, JSONObject jo) {
    RestrictedStringDynamicParameterValue value = req.bindJSON(RestrictedStringDynamicParameterValue.class, jo);
    return checkValue(value);
  }

  @Override
  public ParameterValue createValue(StaplerRequest req) {
    String[] value = req.getParameterValues(getName());
    String[] dynamicValue = req.getParameterValues(this.dynamicName);
    return checkValue(new RestrictedStringDynamicParameterValue(getName(), value[0], this.dynamicName, dynamicValue[0]));
  }

}
