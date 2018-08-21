package org.jenkins.plugins.xmlrpcplugin.handlers;

@SuppressWarnings("serial")
public class JenkinsXmlRpcException extends RuntimeException {
    public JenkinsXmlRpcException(String msg) {
        super(msg);
    }
}
