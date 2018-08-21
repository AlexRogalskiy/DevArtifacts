package org.jenkins.plugins.xmlrpcplugin;

import hudson.Extension;
import hudson.Plugin;
import hudson.model.RootAction;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.xmlrpc.XmlRpcException;
import org.apache.xmlrpc.server.PropertyHandlerMapping;
import org.apache.xmlrpc.server.XmlRpcErrorLogger;
import org.apache.xmlrpc.server.XmlRpcServerConfigImpl;
import org.apache.xmlrpc.webserver.XmlRpcServletServer;
import org.jenkins.plugins.xmlrpcplugin.handlers.JenkinsXmlRpcApiHandler;
import org.kohsuke.stapler.StaplerRequest;
import org.kohsuke.stapler.StaplerResponse;


//@ExportedBean
@Extension
public class JenkinsXmlRpcPlugin extends Plugin implements RootAction {
    public static String VERSION = "1.0-SNAPSHOT";
    private String encoding = XmlRpcServerConfigImpl.UTF8_ENCODING;
    private static XmlRpcServletServer server;

    public void doXmlrpc(StaplerRequest req, StaplerResponse rsp)
            throws Exception {
        init();
        server.execute(req, rsp);
    }

    public String getIconFileName() {
        return null;
    }

    public String getDisplayName() {
        return null;
    }

    public String getUrlName() {
        return "rpc";
    }

    void init() throws Exception {
        XmlRpcServerConfigImpl config = new XmlRpcServerConfigImpl();
        config.setBasicEncoding(encoding);
        config.setEnabledForExceptions(true);
        config.setEnabledForExceptions(true);

        server = new XmlRpcServletServer();
        server.setConfig(config);
        server.setErrorLogger(new XmlRpcErrorLogger());

        PropertyHandlerMapping phm = new PropertyHandlerMapping() {
            @Override
            protected void registerPublicMethods(String pKey, Class pType)
                    throws XmlRpcException {
                Map map = new HashMap();
                Method[] methods = pType.getMethods();
                for (int i = 0; i < methods.length; i++) {
                    final Method method = methods[i];
                    if (!isHandlerMethod(method)) {
                        continue;
                    }
                    String name = method.getName();
                    Method[] mArray;
                    Method[] oldMArray = (Method[]) map.get(name);
                    if (oldMArray == null) {
                        mArray = new Method[] { method };
                    } else {
                        mArray = new Method[oldMArray.length + 1];
                        System.arraycopy(oldMArray, 0, mArray, 0,
                                oldMArray.length);
                        mArray[oldMArray.length] = method;
                    }
                    map.put(name, mArray);
                }

                for (Iterator iter = map.entrySet().iterator(); iter.hasNext();) {
                    Map.Entry entry = (Map.Entry) iter.next();
                    String name = (String) entry.getKey();
                    Method[] mArray = (Method[]) entry.getValue();
                    handlerMap.put(name, newXmlRpcHandler(pType, mArray));
                }
            }
        };
        phm.addHandler("xmlrpc", JenkinsXmlRpcApiHandler.class);

        server.setHandlerMapping(phm);
        server.setTypeFactory(new JenkinsXmlRpcTypeFactory(server));
    }
}
