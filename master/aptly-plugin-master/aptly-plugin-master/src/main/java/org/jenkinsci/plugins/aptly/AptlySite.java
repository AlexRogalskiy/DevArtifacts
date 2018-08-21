/*
 * The MIT License
 *
 * Copyright (c) 2017 Zoltan Gyarmati (https://zgyarmati.de)
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

import org.apache.commons.lang.StringUtils;

import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.DataBoundSetter;

/**
 * This class represents an Aptly site's connection and authentication details
 * @author $Author: zgyarmati <mr.zoltan.gyarmati@gmail.com>
 */
public class AptlySite {

    public enum GPGPASSPHRASETYPE
    {
        PASSPHRASE,PASSPHRASEFILE
    }
    
    /** The profile name. */
    private String mProfileName;

    /** The hostname. */
    private String mUrl;

    /** The time out. */
    private int mTimeout;

    /** The port. */
    private boolean mEnableSelfSigned;

    /** The username. */
    private String mUsername;

    /** The password. */
    private String mPassword;

    /**  */
    private boolean mGpgEnabled;

    /** */
    private String mGpgKeyname;
    
    /** */
    private String mGpgKeyring;
    
    /** */
    private String mGpgSecretKeyring;
    
    /** */
    private String mGpgPassphraseType;
    
    /** */
    private String mGpgPassphrase;
    
    /** */
    private String mGpgPassphraseFile;

    
        
    /**
    * Instantiates a new Aptly site.
    */
    public AptlySite() {

    }

    /**
    * Instantiates a new Aptly site.
    *
    * @param profileName
    *          the profile name
    * @param url
    *          http[s]://hostname:port
    * @param enableSelfSigned
    *          sets whether self-signed SSL cert is allowed
    * @param timeOut
    *          the time out
    * @param username
    *          the username
    * @param password
    *          the password
     * @throws org.jenkinsci.plugins.aptly.AptlyRestException
    */
    @DataBoundConstructor
    public AptlySite(String profileName, String url, boolean enableSelfSigned, 
                     int timeOut, String username, String password, Boolean gpgenabled, 
                     String gpgkeyname, String gpgkeyring, String gpgsecretkeyring,
                     String gpgpassphrasetype, String gpgpassphrase, String gpgpassphrasefile)
                     throws AptlyRestException
    {
        
        this.mProfileName = profileName;
        this.mUrl = url;
        this.mEnableSelfSigned = enableSelfSigned;
        this.mTimeout = timeOut;
        this.mUsername = username;
        this.mPassword = password;
        this.mGpgEnabled = gpgenabled;
        this.mGpgKeyring = gpgkeyring;
        this.mGpgKeyring = gpgkeyname;
        this.mGpgSecretKeyring = gpgsecretkeyring;
        this.mGpgPassphraseType = gpgpassphrasetype;
        this.mGpgPassphrase = gpgpassphrase;
        this.mGpgPassphraseFile = gpgpassphrasefile;
        
    }

    /**
    * Instantiates a new Aptly site.
    *
    * @param hostname the hostname (or IP) of the Aptly site
    * @param port     the port
    * @param timeOut  the time out
    * @param username the username
    * @param password the password
    * @throws org.jenkinsci.plugins.aptly.AptlyRestException
    */
    public AptlySite(String url, String enableSelfSigned, String timeOut, 
                     String username, String password) throws AptlyRestException
    {
        this.mUrl = url;
        try {
            this.mEnableSelfSigned = Boolean.parseBoolean(enableSelfSigned);
        } catch (Exception e) {
            this.mEnableSelfSigned = false;
        }
        this.mTimeout = Integer.parseInt(timeOut);
        this.mUsername = username;
        this.mPassword = password;
        if (mUrl.isEmpty()){
            throw new AptlyRestException("URL is empty!");
        }
    }

    /**
    * Gets the time out.
    *
    * @return the time out
    */
    public int getTimeOut()
    {
        return mTimeout;
    }

    /**
    * Sets the time out.
    *
    * @param timeOut
    *          the new time out
    */
    @DataBoundSetter
    public void setTimeOut(int timeOut)
    {
        this.mTimeout = timeOut;
    }

    /**
    * Gets the display name.
    *
    * @return the display name
    */
    public String getDisplayName()
    {
        if (StringUtils.isEmpty(mProfileName)) {
            return mUrl;
        } else {
            return mProfileName;
        }
    }

    /**
    * Gets the profile name.
    *
    * @return the profile name
    */
    public String getProfileName()
    {
        return mProfileName;
    }

    /**
    * Sets the profile name.
    *
    * @param profileName
    *          the new profile name
    */
    @DataBoundSetter
    public void setProfileName(String profileName)
    {
        this.mProfileName = profileName;
    }

    /**
    * Gets the url.
    *
    * @return the hostname
    */
    public String getUrl() {
        return mUrl;
    }

    /**
    * Sets the url
    *
    * @param url
    *          the new hostname
    */
    @DataBoundSetter
    public void setUrl(String url)
    {
        this.mUrl = url;
    }

    /**
    * Gets whether self signed cert enabled
    *
    * @return the value
    */
    public String getEnableSelfSigned()
    {
        return  "" + this.mEnableSelfSigned;
    }

    /**
    *
    * @param enabled
    *          whether accepting of self signed certs in enabled
    */
    @DataBoundSetter
    public void setEnableSelfSigned(String enabled)
    {
        if (enabled != null) {
            try {
                this.mEnableSelfSigned = Boolean.parseBoolean(enabled);
            } catch (Exception e) {
                this.mEnableSelfSigned = false;
            }
        } else {
            this.mEnableSelfSigned = false;
        }
    }


    /**
    * Gets the username.
    *
    * @return the username
    */
    @DataBoundSetter
    public String getUsername()
    {
        return mUsername;
    }

    /**
    * Sets the username.
    *
    * @param username
    *          the new username
    */
    @DataBoundSetter
    public void setUsername(String username)
    {
        this.mUsername = username;
    }

    /**
    * Gets the password.
    *
    * @return the password
    */
    public String getPassword()
    {
        return mPassword;
    }

    /**
    * Sets the password.
    *
    * @param password
    *          the new password
    */
    @DataBoundSetter
    public void setPassword(String password)
    {
        this.mPassword = password;
    }

    /**
    * Gets the name.
    *
    * @return the name
    */
    public String getName()
    {
        return this.mProfileName;
    }
    
    public String getGpgEnabled()
    {
        return "" + mGpgEnabled;
    }
    
    @DataBoundSetter
    public void setGpgEnabled(boolean mGpgEnabled)
    {
        this.mGpgEnabled = mGpgEnabled;
    }
    
    public String getGpgKeyname() 
    {
        return mGpgKeyname;
    }
    
    @DataBoundSetter
    public void setGpgKeyname(String gpgKeyname) 
    {
        this.mGpgKeyname = gpgKeyname;
    }
    
    public String getGpgKeyring() 
    {
        return mGpgKeyring;
    }
    @DataBoundSetter 
    public void setGpgKeyring(String gpgKeyring) 
    {
        this.mGpgKeyring = gpgKeyring;
    }
    @DataBoundSetter
    public String getGpgSecretKeyring()
    {
        return mGpgSecretKeyring;
    }
    @DataBoundSetter
    public void setGpgSecretKeyring(String gpgSecretKeyring)
    {
        this.mGpgSecretKeyring = gpgSecretKeyring;
    }
    
    public String getGpgPassphraseType()
    {
        return mGpgPassphraseType;
    }
    @DataBoundSetter
    public void setGpgPassphraseType(String gpgPassphraseType)
    {
        this.mGpgPassphraseType = gpgPassphraseType;
    }
    
    public String getGpgPassphrase()
    {
        return mGpgPassphrase;
    }
    @DataBoundSetter
    public void setGpgPassphrase(String gpgPassphrase)
    {
        this.mGpgPassphrase = gpgPassphrase;
    }

    public String getGpgPassphraseFile()
    {
        return mGpgPassphraseFile;
    }
    @DataBoundSetter
    public void setGpgPassphraseFile(String gpgPassphraseFile)
    {
        this.mGpgPassphraseFile = gpgPassphraseFile;
    }
}
