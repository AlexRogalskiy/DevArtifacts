package com.mnk.jenkins.plugins.dockerparameter;

import com.cloudbees.plugins.credentials.CredentialsMatcher;
import com.cloudbees.plugins.credentials.CredentialsMatchers;
import com.cloudbees.plugins.credentials.CredentialsProvider;
import com.cloudbees.plugins.credentials.common.StandardCredentials;
import com.cloudbees.plugins.credentials.common.StandardListBoxModel;
import com.cloudbees.plugins.credentials.common.UsernamePasswordCredentials;
import com.cloudbees.plugins.credentials.domains.DomainRequirement;
import com.ctc.wstx.util.StringUtil;
import hudson.Extension;
import hudson.Util;
import hudson.cli.CLICommand;
import hudson.model.Hudson;
import hudson.model.ParameterDefinition;
import hudson.model.ParameterValue;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import hudson.security.ACL;
import hudson.util.FormValidation;
import hudson.util.ListBoxModel;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.QueryParameter;
import org.kohsuke.stapler.StaplerRequest;

public class DockerRegistryParameterDefinition extends ParameterDefinition {
    private static final long serialVersionUID = -2946187268529655645L;
    private static final Logger LOGGER = Logger.getLogger(DockerRegistryParameterDefinition.class.getName());
    private static final Pattern MATCH_ALL = Pattern.compile(".*");
    private transient int maxItemLimit = Integer.MIN_VALUE;
    private transient Pattern itemFilterPattern = null;

    private String registryBaseUrl;
    private String itemFilter;
    private SortOrder sortOrder;
    private String maxItems;
    private String credentialsId;
    private String value;
    private String defaultValue;
    private String repository;

    @DataBoundConstructor
    public DockerRegistryParameterDefinition(String name, String description, String registryBaseUrl,
                                             String repository, String itemFilter, String sortOrder,
                                             String defaultValue, String maxItems, String credentialsId) {
        super(name, description);
        this.registryBaseUrl = Util.removeTrailingSlash(registryBaseUrl);
        this.repository = Util.removeTrailingSlash(repository);
        this.itemFilter = itemFilter;
        this.sortOrder = SortOrder.valueOf(sortOrder);
        this.defaultValue = StringUtils.trim(defaultValue);
        this.maxItems = maxItems;
        this.credentialsId = credentialsId;
    }

    @Override
    public DescriptorImpl getDescriptor() {
        return (DescriptorImpl) super.getDescriptor();
    }

    public List<String> getItems() {
        String apiVersion = DockerRegistryHelper.getRegistryApiVersion(this.registryBaseUrl);
        List<String> tags = new ArrayList<String>();

        if (StringUtils.contains(this.registryBaseUrl, DockerRegistryConstants.DOCKER_HUB_INDEX)) {
            tags = getTagsFromHub();
        } else if (apiVersion.equalsIgnoreCase(RegistryApiVersion.V1.getName())) {
            tags = getTagsFromRegistryV1();
        } else if (apiVersion.equalsIgnoreCase(RegistryApiVersion.V2.getName())) {
            tags = getTagsFromRegistryV2();
        } else {
            LOGGER.warning(Messages.DockerRegistryParameterDefinition_UnknownRegistryVersion());
        }

        Collections.sort(tags);
        if (this.sortOrder == SortOrder.DESC) {
            Collections.reverse(tags);
        }

        tags = filterItems(tags);

        return tags;
    }

    private List<String> getTagsFromRegistryV1() {
        List<String> tags = new ArrayList<String>();
        String url = new StringBuilder(this.registryBaseUrl)
                .append("/v1/repositories/")
                .append(this.repository)
                .append("/tags")
                .toString();

        org.json.JSONObject jsonObject = DockerRegistryHelper.get(url).getBody().getObject();

        if (jsonObject != null) {
            Iterator keys = jsonObject.keys();

            while (keys.hasNext()) {
                String tag = (String) keys.next();
                if (StringUtils.isNotBlank(tag)) {
                    tags.add(tag);
                }
            }
        }
        return tags;
    }

    private List<String> getTagsFromRegistryV2() {
        List<String> tags = new ArrayList<String>();
        String url = new StringBuilder(this.registryBaseUrl)
                .append("/v2/")
                .append(this.repository)
                .append("/tags/list")
                .toString();

        org.json.JSONObject jsonParentObject = DockerRegistryHelper.get(url).getBody().getObject();

        if (jsonParentObject != null) {
            try {
                JSONArray jsonArray = jsonParentObject.getJSONArray("tags");
                for (int i = 0; i < jsonArray.length(); i++) {
                    tags.add(jsonArray.getString(i));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return tags;
    }

    private List<String> getTagsFromHub() {
        List<String> tags = new ArrayList<String>();
        String url = new StringBuilder(this.registryBaseUrl)
                .append("/v1/repositories/")
                .append(this.repository)
                .append("/tags")
                .toString();
        JSONArray jsonArray = DockerRegistryHelper.get(url).getBody().getArray();

        if (jsonArray != null) {
            try {
                for (int i = 0; i < jsonArray.length(); i++) {
                    tags.add(jsonArray.getJSONObject(i).get("name").toString());
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return tags;
    }

    protected UsernamePasswordCredentials findCredentialsByCredentialsId() {
        List<UsernamePasswordCredentials> credentials =
                CredentialsProvider.lookupCredentials(UsernamePasswordCredentials.class, Hudson.getInstance(), ACL.SYSTEM,
                        new DomainRequirement());
        CredentialsMatcher credentialsMatcher = CredentialsMatchers.withId(this.credentialsId);
        return CredentialsMatchers.firstOrNull(credentials, credentialsMatcher);
    }

    public int getMaxItemLimit() {
        this.maxItemLimit = Integer.MAX_VALUE;
        if (StringUtils.isNotBlank(this.maxItems)) {
            try {
                this.maxItemLimit = Integer.parseInt(this.maxItems);
            } catch (NumberFormatException e) {
                // NO-OP
            }
        }
        return this.maxItemLimit;
    }

    private List<String> filterItems(List<String> allItems) {
        List<String> filteredItems = new ArrayList<String>(allItems.size());
        for (String item : allItems) {
            if (getItemFilterPattern().matcher(item).matches()) {
                filteredItems.add(item);
                if (filteredItems.size() == getMaxItemLimit()) {
                    break;
                }
            }
        }
        return filteredItems;
    }

    public Pattern getItemFilterPattern() {
        if (itemFilterPattern == null) {
            if (StringUtils.isNotBlank(this.itemFilter)) {
                itemFilterPattern = Pattern.compile(this.itemFilter);
            } else {
                itemFilterPattern = MATCH_ALL;
            }
        }
        return itemFilterPattern;
    }

    public String getRegistryBaseUrl() {
        if (StringUtils.isNotBlank(this.registryBaseUrl)) {
            return this.registryBaseUrl;
        }
        return "";
    }

    public void setRegistryBaseUrl(String registryBaseUrl) {
        this.registryBaseUrl = registryBaseUrl;
    }

    public String getRepository() {
        return this.repository;
    }

    public void setRepository(String repository) {
        this.repository = repository;
    }

    public String getMaxItems() {
        return this.maxItems;
    }

    public void setMaxItems(String maxItems) {
        this.maxItems = maxItems;
    }

    public String getItemFilter() {
        return this.itemFilter;
    }

    public void setItemFilter(String itemFilter) {
        this.itemFilter = itemFilter;
    }

    public String getCredentialsId() {
        return this.credentialsId;
    }

    public void setCredentialsId(String credentialsId) {
        this.credentialsId = credentialsId;
    }

    private ParameterValue createValue(String value) {
        return new DockerRegistryParameterValue(getName(), value);
    }

    @Override
    public ParameterValue createValue(CLICommand command, String value) {
        return createValue(value);
    }

    @Override
    public ParameterValue createValue(StaplerRequest request) {
        String[] values = request.getParameterValues(getName());
        if (values == null || values.length == 0) {
            return this.getDefaultParameterValue();
        }
        String value = values[0];
        return createValue(value);
    }

    @Override
    public ParameterValue createValue(StaplerRequest request, JSONObject formData) {
        DockerRegistryParameterValue value = request.bindJSON(DockerRegistryParameterValue.class, formData);
        value.setDescription(getDescription());
        return value;
    }

    @Override
    public ParameterValue getDefaultParameterValue() {
        return super.getDefaultParameterValue();
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public enum SortOrder {
        DESC("Descending"), ASC("Ascending");

        private String displayName;

        public String getDisplayName() {
            return this.displayName;
        }

        SortOrder(String displayName) {
            this.displayName = displayName;
        }
    }

    public enum RegistryApiVersion {
        V1("v1"), V2("v2");

        private String name;

        public String getName() {
            return this.name;
        }

        RegistryApiVersion(String name) {
            this.name = name;
        }
    }

    @Extension
    public static class DescriptorImpl extends ParameterDescriptor {
        @Override
        public String getDisplayName() {
            return Messages.DockerRegistryParameterDefinition_DisplayName();
        }

        public ListBoxModel doFillCredentialsIdItems() {
            List<StandardCredentials> credentials =
                    CredentialsProvider.lookupCredentials(StandardCredentials.class,
                            Hudson.getInstance(),
                            ACL.SYSTEM,
                            new DomainRequirement());
            CredentialsMatcher credentialsMatcher = CredentialsMatchers.instanceOf(UsernamePasswordCredentials.class);
            return new StandardListBoxModel().withEmptySelection().withMatching(credentialsMatcher, credentials);
        }

        public FormValidation doCheckItemFilter(@QueryParameter String value) {
            return doCheckRegex(value);
        }

        private static FormValidation doCheckRegex(String value) {
            if (StringUtils.isNotBlank(value)) {
                try {
                    Pattern.compile(value);
                } catch (PatternSyntaxException e) {
                    FormValidation.error(Messages.DockerRegistryParameterDefinition_InvalidRegex());
                }
            }
            return FormValidation.ok();
        }

        public SortOrder[] getSortOrders() {
            return SortOrder.values();
        }
    }
}
