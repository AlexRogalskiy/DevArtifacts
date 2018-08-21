/*
 * The MIT License
 *
 * Copyright (c) 2017 Zoltan Gyarmati (http://zgyarmati.de)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

package org.jenkinsci.plugins.aptly;



import org.json.JSONObject;
import org.json.JSONArray;

import java.io.PrintStream;
import java.util.List;
import java.io.File;

import javax.net.ssl.SSLContext;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.conn.ssl.*;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.HttpRequest;
import com.mashape.unirest.request.GetRequest;
import com.mashape.unirest.request.HttpRequestWithBody;


/**
 * This class implements a subset of the Aptly REST client calls
 * as documented at
 * http://www.aptly.info/doc/api/
 * @author $Author: zgyarmati <mr.zoltan.gyarmati@gmail.com>
 */
public class AptlyRestClient {


    private AptlySite   mSite;
    private PrintStream mLogger;

    public AptlyRestClient(PrintStream logger, AptlySite site)
    {
        
        this.mSite = site;
        this.mLogger = logger;
        if (Boolean.parseBoolean(site.getEnableSelfSigned())){
            try{
                SSLContext sslcontext = SSLContexts.custom()
                    .loadTrustMaterial(null, new TrustSelfSignedStrategy())
                    .build();
                SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslcontext,SSLConnectionSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
                CloseableHttpClient httpclient = HttpClients.custom()
                    .setSSLSocketFactory(sslsf)
                    .build();
                Unirest.setHttpClient(httpclient);
            } catch (Exception ex) {
                logger.println("Failed to setup ssl self");
            }
        }
    }
    
    
    /** Sends the request, after doing the common configuration (accept header,
     * auth...) and returns the answer as JSON, or throws the error.
     * @param req the UniRest HttpRequest to send
     * @return the answer as JSON
     */
    private JSONObject sendRequest(HttpRequest req) throws AptlyRestException
    {   
        HttpResponse<String> response;
        if(!mSite.getUsername().isEmpty()){
                req.basicAuth(mSite.getUsername(), mSite.getPassword());
        }
        
        req = req.header("accept", "application/json");
        try {
            response = req.asString();
        }
        catch (UnirestException ex) {
            throw new AptlyRestException("API request failed: " + ex.getMessage());
        }
        
        if (response.getStatus() != 200){
            throw new AptlyRestException("API request failed, response from server: " + 
                                          response.getStatusText());
        } 
        mLogger.printf("Aptly API response code: <%d>, body: <%s>\n",
                    response.getStatus(), response.getBody().trim());
        
        JSONObject json = new JSONObject();
        
        try {
            json = new JSONObject(response.getBody());
        }
        catch(org.json.JSONException ex){
            // grr, the upload request gives back a JSON array, 
            // not object as all the others, so let the hack begin...
            try {
                JSONArray ja = new JSONArray(response.getBody());
                json.put("UploadedFiles", ja);
            }
            catch (org.json.JSONException e) {
                mLogger.printf("Response JSON parsing error <%s>, ignoring",e.getMessage());
            }
        }
        return json;
    }
    
    
    public String getAptlyServerVersion() throws AptlyRestException
    {
        String retval;
        try {
            GetRequest req = Unirest.get(mSite.getUrl() +"/api/version");
            JSONObject res = sendRequest(req);
            mLogger.println("Version response" + res.toString());
            retval = res.getString("Version");
            return retval;
        }
        catch(AptlyRestException e){
            throw e;
        }
    }

    
    public void uploadFiles(List<File> filepaths, String uploaddir) throws AptlyRestException
    {
        mLogger.println("upload dir name: " + uploaddir);
        try {
            HttpRequestWithBody req = Unirest.post(mSite.getUrl() +
                                         "/api/files/" + uploaddir);
            req.field("file", filepaths);
            JSONObject res = sendRequest(req);
        }
        catch (AptlyRestException ex) {
            mLogger.printf("Failed to upload the packages: %s\n", ex.toString());
            throw ex;
        }
    }

    
    public void addUploadedFilesToRepo(String reponame, String uploaddir) throws AptlyRestException
    {
        // add to the repo
        try {
            HttpRequestWithBody req = Unirest.post(mSite.getUrl() +
                                            "/api/repos/"+ reponame +"/file/" + uploaddir);
            req.queryString("forceReplace", "1");
            JSONObject res = sendRequest(req);
            mLogger.printf("Uploaded packages added to repo, response: %s\n", res.toString());
        }
        catch (AptlyRestException ex) {
            mLogger.printf("Failed to add uploaded packages to repo: %s\n", ex.toString());
            throw ex;
        }
    }

    // update published repo
    public void updatePublishRepo(String prefix, String distribution) throws AptlyRestException
    {
        try {
            HttpRequestWithBody req = Unirest.put(mSite.getUrl() + "/api/publish/"
                                                  + prefix + "/" + distribution);
            req = req.header("Content-Type", "application/json");
            JSONObject options = new JSONObject();
            options.put("ForceOverwrite", true);
            options.put("Signing",buildSigningJson());
            req.body(options.toString());
            JSONObject res = sendRequest(req);
            
        } 
        catch (AptlyRestException ex) {
            mLogger.printf("Failed to publish repo: " + ex.toString());
            throw ex;
        }
    }

    private JSONObject buildSigningJson()
    {
        JSONObject retval = new JSONObject();
        if (!Boolean.parseBoolean(mSite.getGpgEnabled())){
            retval.put("Skip",true);
            return retval;
        }
        
        retval.put("Skip",false);
        
        if (!mSite.getPassword().isEmpty()){
            retval.put("Batch",true);
        }
        
        if (!mSite.getGpgKeyname().isEmpty()){
            retval.put("GpgKey",mSite.getGpgKeyname());
        }
        
        if (!mSite.getGpgKeyring().isEmpty()){
            retval.put("Keyring",mSite.getGpgKeyring());
        }
        
        if (!mSite.getGpgSecretKeyring().isEmpty()){
            retval.put("SecretKeyring",mSite.getGpgSecretKeyring());
        }
        
        if ("passphrase".equals(mSite.getGpgPassphraseType())){
                retval.put("Passphrase",mSite.getGpgPassphrase());
        }
        
        else if ("passphrasefile".equals(mSite.getGpgPassphraseType())){
                retval.put("Passphrase",mSite.getGpgPassphraseFile());
        }
        
        return retval;
    }
}
