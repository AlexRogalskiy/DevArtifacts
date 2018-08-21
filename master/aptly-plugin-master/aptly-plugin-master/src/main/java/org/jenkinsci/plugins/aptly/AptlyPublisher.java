/*
 * The MIT License
 *
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

import hudson.Extension;
import hudson.Launcher;
import hudson.Util;
import hudson.model.AbstractBuild;
import hudson.model.AbstractProject;
import hudson.model.BuildListener;
import hudson.model.Descriptor;
import hudson.model.Result;
import hudson.tasks.BuildStepDescriptor;
import hudson.tasks.BuildStepMonitor;
import hudson.tasks.Notifier;
import hudson.tasks.Publisher;
import hudson.util.CopyOnWriteList;
import hudson.util.FormValidation;
import hudson.FilePath;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.io.PrintStream;
import java.io.File;
import java.util.UUID;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;

import net.sf.json.JSONObject;

import org.kohsuke.stapler.StaplerRequest;
import org.kohsuke.stapler.QueryParameter;
import org.apache.commons.collections.iterators.ArrayIterator;


/**
 * This class implements the Aptly publisher, takes care of orchestring the
 * configuration and the uploading/publishing process
 * @author $Author: zgyarmati <mr.zoltan.gyarmati@gmail.com>
 */
public class AptlyPublisher extends Notifier {
//     private static final Logger logger = Logger.getLogger("jenkins.AptlyPublisher");
	/**
	 * Hold an instance of the Descriptor implementation of this publisher.
	 */
	@Extension
	public static final DescriptorImpl DESCRIPTOR = new DescriptorImpl();

    private String repoSiteName;
    private final List<PackageItem> packageItems = new ArrayList<PackageItem>();
    private Boolean skip = false;
    private final static Logger LOG = Logger.getLogger(AptlyPublisher.class.getName());

    public AptlyPublisher() { }

    /**
    * The constructor which take a configured Aptly repo site name to use
    *
    * @param repoSiteName
    *          the name of the aptly repo configuration to use
    */
    public AptlyPublisher(String repoSiteName) {
        this.repoSiteName = repoSiteName;
    }

    public void setSkip(boolean skip) {
        this.skip = skip;
    }

    public boolean isSkip() {
        return skip;
    }

    public List<PackageItem> getPackageItems(){
        return this.packageItems;
    }


    public String getRepoSiteName() {
        String repositename = repoSiteName;
        if (repositename == null) {
            AptlySite[] sites = DESCRIPTOR.getSites();
            if (sites.length > 0) {
                repositename = sites[0].getName();
            }
        }
        return repositename;
    }

    public void setRepoSiteName(String repoSiteName) {
        this.repoSiteName = repoSiteName;
    }

    /**
    * This method returns the configured AptlySite object which match the repoSiteName.
    * (see Manage Hudson and System
    * Configuration point FTP)
    *
    * @return the matching AptlySite or null
    */
    public AptlySite getSite() {
        AptlySite[] sites = DESCRIPTOR.getSites();
        if (repoSiteName == null && sites.length > 0) {
            // default
            return sites[0];
        }
        for (AptlySite site : sites) {
            if (site.getDisplayName().equals(repoSiteName)) {
                return site;
            }
        }
        return null;
    }

    public BuildStepMonitor getRequiredMonitorService() {
        return BuildStepMonitor.BUILD;
    }

   /**
    * {@inheritDoc}
    *
    * @param build
    * @param launcher
    * @param listener
    * @return
    * @throws InterruptedException
    * @throws IOException
    *           {@inheritDoc}
    * @see hudson.tasks.BuildStep#perform(hudson.model.Build, hudson.Launcher, hudson.model.BuildListener)
    */
    @Override
    public boolean perform(AbstractBuild<?, ?> build, Launcher launcher, BuildListener listener) throws InterruptedException, IOException {

        listener.getLogger().println("Perform AptlyPublisher ");
        if (skip != null && skip) {
            listener.getLogger().println("Publish built packages via Aptly - Skipping... ");
            return true;
        }

        if (build.getResult() == Result.FAILURE || build.getResult() == Result.ABORTED) {
            // build failed
            return true;
        }

        Map<String, String> envVars  = build.getEnvironment(listener);

        AptlySite aptlysite = null;
            aptlysite = getSite();
            listener.getLogger().println("Using aptly site: " + aptlysite.getUrl());
            listener.getLogger().println("Self signed enabled: " + aptlysite.getEnableSelfSigned());
            listener.getLogger().println("Username: " + aptlysite.getUsername());
            listener.getLogger().println("Timeout: " + aptlysite.getTimeOut());


            AptlyRestClient client = new AptlyRestClient(listener.getLogger(),aptlysite);

        try {
            String result = client.getAptlyServerVersion();
            listener.getLogger().println("Aptly API version response: " +  result);
        } catch (Throwable th) {
            th.printStackTrace(listener.error("Failed to connect to the server"));
            build.setResult(Result.UNSTABLE);
            return false;
        }
        List <PackageItem> itemlist = getPackageItems();
        for (PackageItem i : itemlist) {
            final String reponame = Util.replaceMacro(i.getRepositoryName(), envVars);
            final String repoprefix = Util.replaceMacro(i.getPrefixName(), envVars);
            final String distribution = Util.replaceMacro(i.getDistributionName(), envVars);
            listener.getLogger().println("Repo name: " + reponame);
            listener.getLogger().println("Repo prefix: " + repoprefix);
            listener.getLogger().println("Repo distribution: " + distribution);

            String uploaddirid = envVars.get("JOB_NAME") + "-" +
                                 envVars.get("BUILD_NUMBER") + "-" +
                                 UUID.randomUUID().toString().substring(0,6);
            // Creating a temp dir for copying the remote files
            File tempDir = File.createTempFile("aptlyplugin", null);
            tempDir.delete();
            tempDir.mkdirs();

            FilePath workspace = new FilePath(launcher.getChannel(), build.getWorkspace().getRemote());
            //expand the macros like ${BUILD_NUM}
            String expanded = Util.replaceMacro(i.getSourceFiles(), envVars);
            //expand the file globs
            FilePath[] remoteFiles = workspace.list(expanded);
            if (remoteFiles.length == 0) {
                 listener.getLogger().println("No matching file found to upload in: " + expanded);
                 build.setResult(Result.UNSTABLE);
                 return false;
            }
            //copy the remote file into the local dir, collect all of the
            // filepaths into 'filelist', and pass the list for uploading
            ArrayIterator filesiterator = new ArrayIterator(remoteFiles);
            List<File>  filelist = new ArrayList<File>();
            while (filesiterator.hasNext()) {
                FilePath filepath = (FilePath) filesiterator.next();
                if(filepath.isRemote()) {
                    FilePath localfilepath = new FilePath(new FilePath(tempDir), filepath.getName());
                    filepath.copyTo(localfilepath);
                    filepath = localfilepath;
                }
                File file = new File(filepath.toURI());
                listener.getLogger().println("Found file to upload: " + file.toString());
                //this is already ensured to be a local and absoulute path
                filelist.add(file);
            }
            try {
                client.uploadFiles(filelist, uploaddirid);
            } catch (Throwable th) {
                th.printStackTrace(listener.error("Failed to upload files"));
                build.setResult(Result.UNSTABLE);
            } finally {
                try {
                    FileUtils.deleteDirectory(tempDir);
                } catch (IOException e) {
                    try {
                        FileUtils.forceDeleteOnExit(tempDir);
                    } catch (IOException e1) {
                        e1.printStackTrace(listener.getLogger());
                    }
                }
            }

            // ################### ADD THE PACKAGES TO THE REPO  ###############
            try {
                client.addUploadedFilesToRepo(reponame, uploaddirid);
            } catch (Throwable th) {
                th.printStackTrace(listener.error("Failed to upload files"));
                build.setResult(Result.UNSTABLE);
                return false;
            }

            // ################### UPDATE THE PUBLISHED REPO ###################
            try {
                client.updatePublishRepo(repoprefix, distribution);
            } catch (Throwable th) {
                th.printStackTrace(listener.error("Failed to upload files"));
                build.setResult(Result.UNSTABLE);
                return false;
            }
        }
        return true;
    }

    /**
    * This class holds the metadata for the AptlyPublisher.
    * @author zgyarmati <mr.zoltan.gyarmati@gmail.com>
    * @see Descriptor
    */
    public static final class DescriptorImpl extends BuildStepDescriptor<Publisher> {

        private final CopyOnWriteList<AptlySite> sites = new CopyOnWriteList<AptlySite>();
        private final CopyOnWriteList<PackageItem> packageItems = new CopyOnWriteList<PackageItem>();
        private final static Logger LOG = Logger.getLogger(DescriptorImpl.class.getName());


        /**
        * The default constructor.
        */
        public DescriptorImpl() {
            super(AptlyPublisher.class);
            load();
        }

        /**
        * The name of the plugin to display them on the project configuration web page.
        *
        * {@inheritDoc}
        *
        * @return {@inheritDoc}
        * @see hudson.model.Descriptor#getDisplayName()
        */
        @Override
        public String getDisplayName() {
            return "Publish built packages via Aptly";
        }

        /**
        * The getter for the packageItems field. (this field is set by the UI part of this plugin see config.jelly file)
        *
        * @return the value of the packageItems field
        */
        public CopyOnWriteList<PackageItem> getPackageItems() {
            return packageItems;
        }


        @Override
        public boolean isApplicable(Class<? extends AbstractProject> jobType) {
            return true;
        }

        /**
        * This method is called by hudson if the user has clicked the add button of the Aptly site hosts point in the System Configuration
        * web page. It's create a new instance of the {@link AptlyPublisher} class and added all configured ftp sites to this instance by calling
        * the method {@link AptlyPublisher#getEntries()} and on it's return value the addAll method is called.
        *
        * {@inheritDoc}
        *
        * @param req
        *          {@inheritDoc}
        * @return {@inheritDoc}
        * @see hudson.model.Descriptor#newInstance(org.kohsuke.stapler.StaplerRequest)
        */
        @Override
        public Publisher newInstance(StaplerRequest req, JSONObject formData) {
           AptlyPublisher pub = new AptlyPublisher();
           try {
                List<PackageItem> entries = req.bindJSONToList(PackageItem.class, formData.get("packageItems"));
                pub.getPackageItems().addAll(entries);
           } catch (Exception e) {
               LOG.severe(">> bindJSONToList Exception: " + e.getMessage());
               return null;
           }
           return pub;
        }


        /**
        * The getter of the sites field.
        *
        * @return the value of the sites field.
        */
        public AptlySite[] getSites() {
            Iterator<AptlySite> it = sites.iterator();
            int size = 0;
            while (it.hasNext()) {
                it.next();
                size++;
            }
            return sites.toArray(new AptlySite[size]);
        }

        /**
        * {@inheritDoc}
        *
        * @param req
        *          {@inheritDoc}
        * @return {@inheritDoc}
        * @see hudson.model.Descriptor#configure(org.kohsuke.stapler.StaplerRequest)
        */
        @Override
        public boolean configure(StaplerRequest req, JSONObject formData) 
        {
            
            List<AptlySite> asites = req.bindJSONToList(AptlySite.class,
                                        formData.get("site"));
            sites.replaceBy(asites);
            save();
            return true;
        }
        /**
        * This method validates the current entered Aptly site configuration data.
        * @param request the current {@link javax.servlet.http.HttpServletRequest}
        */
        public FormValidation doLoginCheck(
                                           @QueryParameter("aptly.profileName") final String sitename,
                                           @QueryParameter("aptly.url") final String url,
                                           @QueryParameter("aptly.enableSelfSigned") final String enableselfsigned,
                                           @QueryParameter("aptly.timeOut") final String timeout,
                                           @QueryParameter("aptly.username") final String username,
                                           @QueryParameter("aptly.password") final String password)
        {
            LOG.info("Login check for " + sitename);
            PrintStream logstream = new PrintStream(new LogOutputStream(), true);
            try {
                AptlySite site = new AptlySite(url,enableselfsigned,timeout,username,password);
                AptlyRestClient client =  new AptlyRestClient(logstream, site);
                final String ver = client.getAptlyServerVersion();
                LOG.info("got version " + ver);
                return FormValidation.ok("Success, Aptly version: " + ver);
            } catch (Exception e) {
                return FormValidation.error(e.getMessage());
            }
        }
    }
}
