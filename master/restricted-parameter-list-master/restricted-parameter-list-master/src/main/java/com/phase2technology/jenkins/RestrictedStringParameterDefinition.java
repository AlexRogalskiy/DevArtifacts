package com.phase2technology.jenkins;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import java.io.IOException;

import hudson.Extension;
import hudson.model.ParameterDefinition;
import hudson.model.ParameterValue;
import hudson.model.StringParameterValue;
import hudson.model.User;
import hudson.model.Hudson;

import net.sf.json.JSONObject;

import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.StaplerRequest;

/**
 * String based parameter that supports picking the string from a list of values
 * presented at build time generated from command specified in job configuration
 * for this parameter
 *
 * @author Chris Johnson 
 * @see {@link ParameterDefinition}
 */
public class RestrictedStringParameterDefinition extends ParameterDefinition {
  static final long serialVersionUID = 2;
  private static final Logger LOG = Logger.getLogger(RestrictedStringParameterDefinition.class.getName());
  public final String command;

  public RestrictedStringParameterDefinition(String name, String command) {
    super(name);
    this.command = command;
  }

  @DataBoundConstructor
  public RestrictedStringParameterDefinition(String name, String command, String description) {
    super(name, description);
    this.command = command;
  }

  @Extension
  public static class DescriptorImpl extends ParameterDescriptor {
    @Override
    public String getDisplayName() {
      return "Restricted String Parameter";
    }
  }

  protected User getUser() {
    try {
      return Hudson.getInstance().getMe();
    } catch (Exception e) {
      try {
        return Hudson.getInstance().getUser(Hudson.ANONYMOUS.getName());
      } catch (Exception e2) {
        return null;
      }
    }
  }

  public List<String> getAllowedValues() throws IOException {
    return this.getAllowedValues(this.command, "");
  }

  /**
   * Executes a process defined by command with two environmental variables set
   * JENKINS_RSP_USER with the id (username) of the current user
   * JENKINS_RSP_VALUE with the value of param
   * @param command
   * @param param
   * @return List of Strings representing each possible value of this parameter
   */
  public List<String> getAllowedValues(String command, String param) throws IOException {
    List<String> allowed = new ArrayList<String>();
    try {
      String[] envp = new String[2];
      User user = this.getUser();
      envp[0] = "JENKINS_RSP_USER=" + ((user != null) ? user.getId() : "");
      envp[1] = "JENKINS_RSP_VALUE=" + param;
      Process child = Runtime.getRuntime().exec(command, envp);
      java.io.InputStream in = child.getInputStream();
      StringBuilder sb = new StringBuilder();
      int i;
      while ((i = in.read()) > -1) {
        if (i == '\n' || i == '\r') {
          allowed.add(sb.toString());
          sb.delete(0, sb.length());
        }
        else {
          sb.append((char) i);
        }
      }
      if (sb.length() > 0) {
        allowed.add(sb.toString());
      }
    } catch (IOException e) {
      LOG.warning("IOException while attempting to get allowed parameter list for " + this.getName() + ": " + e.getMessage());
      throw(e);
    }
    return allowed;
  }

  /*
   * Ensure that the data received for requesting a build hasn't been tampered with
   * and still represents an allowed parameter value
   */
  private ParameterValue checkValue(StringParameterValue value) {
    try {
      if (!getAllowedValues().contains(value.value))
        throw new IllegalArgumentException("Illegal choice: " + value.value);
    }
    catch (IOException e) {
      throw new IllegalArgumentException("Could not validate value");
    }
    return value;
  }

  @Override
  public ParameterValue createValue(StaplerRequest req, JSONObject jo) {
    StringParameterValue value = req.bindJSON(StringParameterValue.class, jo);
    return checkValue(value);
  }

  @Override
  public ParameterValue createValue(StaplerRequest req) {
    String[] value = req.getParameterValues(getName());
    return checkValue(new StringParameterValue(getName(), value[0]));
  }
}
