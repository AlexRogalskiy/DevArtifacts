package org.jenkinsci.plugins.reststack;

import hudson.slaves.NodeProperty;
import hudson.util.FormValidation;
import hudson.model.Descriptor;

import org.apache.http.HttpEntity;
import org.apache.http.StatusLine;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.ContentType;

import net.sf.json.JSONObject;

import java.util.UUID;
import java.util.logging.Logger;
import java.util.Collections;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

class RESTStackProvisioner {
    private static final String PROVISION_PATH = "/tenant";
    private static final String TEST_PATH = "/";

    private static final Logger LOGGER = Logger.getLogger(RESTStackProvisioner.class.getName());
    private static long seqNo = -1;

    public static class PermissionDeniedException extends IOException {
        public PermissionDeniedException(String message) {
            super(message);
        }
    }

    private static synchronized long getNextSeqNo() {
        return ++seqNo;
    }

    public static void testConnection(String provisionerUrl, String authToken) throws PermissionDeniedException, IOException {
        CloseableHttpClient client = HttpClients.createDefault();

        try {
            HttpGet req = new HttpGet(provisionerUrl + TEST_PATH);
            req.addHeader("X-Auth-Token", authToken);
            req.addHeader("Accept", "application/json");

            CloseableHttpResponse response = client.execute(req);
            try {
                StatusLine statusLine = response.getStatusLine();
                if (statusLine.getStatusCode() == 200) {
                    return;
                } else if (statusLine.getStatusCode() == 401) {
                    throw new PermissionDeniedException("Access denied");
                } else {
                    throw new IOException("Unexpected status from provisioner: " + statusLine.getStatusCode());
                }
            } finally {
                response.close();
            }
        } finally {
            client.close();
        }
    }

    public static JSONObject getSlaveStatus(RESTStackSlaveTemplate template, String machineName) throws PermissionDeniedException, IOException, Descriptor.FormException {
        String provisionerUrl = template.getCloud().getProvisionerUrl();
        String authToken = template.getCloud().getAuthToken();

        CloseableHttpClient client = HttpClients.createDefault();

        try {
            HttpGet req = new HttpGet(provisionerUrl + PROVISION_PATH + "/" + machineName);
            req.addHeader("X-Auth-Token", authToken);
            req.addHeader("Accept", "application/json");

            CloseableHttpResponse response = client.execute(req);
            try {
                StatusLine statusLine = response.getStatusLine();
                if (statusLine.getStatusCode() == 200) {
                    HttpEntity entity = response.getEntity();
                    if (entity != null) {
                        BufferedReader br = new BufferedReader(new InputStreamReader(entity.getContent()));
                        StringBuffer sb = new StringBuffer();
                        String line;
                        while ((line = br.readLine()) != null) {
                            sb.append(line);
                        }

                        JSONObject obj = JSONObject.fromObject(sb.toString());
                        LOGGER.info("Provision status of machine " + machineName + ": " + obj.getString("status"));
                        if (obj.getString("status").equals("READY"))
                            return obj;
                    }

                    return null;
                } else if (statusLine.getStatusCode() == 401) {
                    throw new PermissionDeniedException("Access denied");
                } else {
                    throw new IOException("Unexpected status from provisioner: " + statusLine.getStatusCode());
                }
            } finally {
                response.close();
            }
        } finally {
            client.close();
        }
    }

    public static RESTStackSlave provisionSlave(RESTStackSlaveTemplate template, String machineName) throws IOException, Descriptor.FormException {
        String provisionerUrl = template.getCloud().getProvisionerUrl();
        String authToken = template.getCloud().getAuthToken();

        CloseableHttpClient client = HttpClients.createDefault();

        try {
            HttpPost req = new HttpPost(provisionerUrl + PROVISION_PATH);
            req.addHeader("X-Auth-Token", authToken);
            req.addHeader("Accept", "application/json");
            req.addHeader("Content-Type", "application/json");
            JSONObject jobj = template.getBaseJson();
            jobj.put("tenant", machineName);
            jobj.put("image_id", template.getImageId());
            // XXX: add support for arbitrary other fields
            req.setEntity(new StringEntity(jobj.toString(), ContentType.APPLICATION_JSON));

            LOGGER.info("Provisioning using base URL: " + provisionerUrl +
                    ", tenant: " + machineName);
            CloseableHttpResponse response = client.execute(req);
            try {
                StatusLine statusLine = response.getStatusLine();
                if (statusLine.getStatusCode() == 201) {
                    // Results available immediately
                    HttpEntity entity = response.getEntity();
                    if (entity != null) {
                        BufferedReader br = new BufferedReader(new InputStreamReader(entity.getContent()));
                        StringBuffer sb = new StringBuffer();
                        String line;
                        while ((line = br.readLine()) != null) {
                            sb.append(line);
                        }

                        JSONObject obj = JSONObject.fromObject(sb.toString());

                        return new RESTStackSlave(template.getCloud().name, machineName,
                                obj.getString("ip"),
                                obj.optInt("ssh_port", 22), template.getDescription(),
                                template.getFsRoot(), template.getJvmOptions(),
                                template.getCredentialsId(), 1, template.getMode(),
                                template.getLabelString(),
                                template.getRetentionStrategy(),
                                Collections.<NodeProperty<?>>emptyList());
                    }
                } else if (statusLine.getStatusCode() == 202) {
                    // Results available at a later time (deferred)
                    // repeatedly call 'GET' until we get a '200' response,
                    // and the status of the object is as expected.
                    JSONObject obj;

                    while ((obj = getSlaveStatus(template, machineName)) == null) {
                        try {
                            Thread.sleep(5000);
                        } catch (InterruptedException e) { }
                    }

                    return new RESTStackSlave(template.getCloud().name, machineName,
                            obj.getString("ip"),
                            obj.optInt("ssh_port", 22), template.getDescription(),
                            template.getFsRoot(), template.getJvmOptions(),
                            template.getCredentialsId(), 1, template.getMode(),
                            template.getLabelString(),
                            template.getRetentionStrategy(),
                            Collections.<NodeProperty<?>>emptyList());

                } else {
                    throw new IOException("Unexpected status from provisioner: " + statusLine.getStatusCode());
                }
            } finally {
                response.close();
            }
        } finally {
            client.close();
        }
        throw new AssertionError("Shouldn't have reached this point.");
    }

    public static RESTStackSlave provisionSlave(RESTStackSlaveTemplate template) throws IOException, Descriptor.FormException {
        // XXX: UUIDs to be used for the time being to avoid problems when Jenkins restarts
        String randomId = UUID.randomUUID().toString();
        String tenantId = template.getName() + "_" + randomId;
        //String tenantId = template.getName() + "_" + getNextSeqNo();
        return provisionSlave(template, tenantId);
    }

    public static void terminateSlave(RESTStackSlave slave) throws IOException {
        String provisionerUrl = slave.getCloud().getProvisionerUrl();
        String authToken = slave.getCloud().getAuthToken();

        CloseableHttpClient client = HttpClients.createDefault();

        try {
            HttpDelete req = new HttpDelete(provisionerUrl + PROVISION_PATH + "/" + slave.getNodeName());
            req.addHeader("X-Auth-Token", authToken);
            req.addHeader("Accept", "application/json");

            LOGGER.info("Terminating slave using URL: " + provisionerUrl + PROVISION_PATH + "/" + slave.getNodeName());
            CloseableHttpResponse response = client.execute(req);
            try {
                StatusLine statusLine = response.getStatusLine();
                if ((statusLine.getStatusCode() == 200) ||
                    (statusLine.getStatusCode() == 204)) {
                } else if (statusLine.getStatusCode() == 202) {
                } else {
                    throw new IOException("Unexpected status from provisioner on termination: " + statusLine.getStatusCode());
                }
            } finally {
                response.close();
            }
        } finally {
            client.close();
        }
    }
}
