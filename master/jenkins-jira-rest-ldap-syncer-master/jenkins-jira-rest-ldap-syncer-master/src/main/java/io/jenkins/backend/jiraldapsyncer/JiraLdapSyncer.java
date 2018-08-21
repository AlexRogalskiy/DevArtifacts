/*
 * The MIT License
 *
 * Copyright (c) 2016, CloudBees, Inc.
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
 *
 */
package io.jenkins.backend.jiraldapsyncer;

import java.rmi.RemoteException;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


public class JiraLdapSyncer {
    public static final String ROLE = "jiraLdapSyncer";

    private static final Log LOG = LogFactory.getLog(JiraLdapSyncer.class);

    private JiraRestClient jiraRestClient;
    private LdapClient ldapClient;

    private boolean addNewLdapUsersToJira;

    public static void main(String[] args) throws RemoteException {
        JiraLdapSyncer jiraLdapSyncer = (JiraLdapSyncer) new ServiceLocator().lookupService(JiraLdapSyncer.ROLE);
        jiraLdapSyncer.sync();
    }

    public void syncOneUserFromLDAPToJIRA(String id) throws RemoteException {
        RemoteUser ldap = getLdapClient().getUser(id);

        RemoteUser jira = getJiraRestClient().getUser(id);

        if (jira!=null) {
            LOG.info(id+ " is already in JIRA");
        } else {
            LOG.info("Adding new ldap user " + id + " into Jira");
            getJiraRestClient().createUser(ldap);
        }
    }


    public void sync() throws RemoteException {
        long start = System.currentTimeMillis();

        // get or create JIRA group for inactive staff ( 'inactive-staff' by default )
        String jiraInactiveStaff = getJiraRestClient().getGroup(getJiraRestClient().getInactiveGroup());

        // retrieve all JIRA inactive users from inactive staff group
        Map<String, RemoteUser> jiraInactiveUsers = getJiraRestClient().getInactiveUsers();

        // retrieve all JIRA users
        Map<String, RemoteUser> jiraUsers = getJiraRestClient().getAllUsers();

        // retrieve all LDAP users
        Map<String, RemoteUser> ldapUsers = getLdapClient().getAllUsers();

        // check if inactive users are still "inactive": if not => delete them from inactive staff group
        int cntNoMoreInactiveJiraUsers = 0;
        for ( RemoteUser inactiveUser : jiraInactiveUsers.values() ) {
            if ( ldapUsers.containsKey(inactiveUser.getName()) ) {
                LOG.info("Jira 'inactive user' " + inactiveUser.getName() + " is now back in LDAP - deleting him from 'inactive-staff' group");
                getJiraRestClient().removeUserFromGroup(inactiveUser, jiraInactiveStaff);
                cntNoMoreInactiveJiraUsers++;
            }
        }

        // 1) add new LDAP users to JIRA 2) check how many users have changed their details in LDAP ( nothing can do with this for now )
        int newLdapUsers = 0;
        int diffData = 0;
        for ( RemoteUser ldapUser : ldapUsers.values() ) {
            if ( ! jiraUsers.containsKey(ldapUser.getName()) ) {
                LOG.info("Adding new ldap user " + ldapUser.getName() + " into Jira");
                try {
                    if ( getJiraRestClient().createUser(ldapUser) ) {
                        newLdapUsers++;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                RemoteUser jiraUser = jiraUsers.get(ldapUser.getName());
                if (
                        !jiraUser.getEmail().equalsIgnoreCase( ldapUser.getEmail() )
                                ||
                                !jiraUser.getFullname().equalsIgnoreCase( ldapUser.getFullname() )
                        ) {
                    LOG.info(
                            "Some fields different in Jira DB and in LDAP for user " + ldapUser.getName() + " - "
                                    + "ldap:{" + ldapUser.getFullname() + ", " + ldapUser.getEmail() + "}"
                                    + ", jira:{" + jiraUser.getFullname() + ", " + jiraUser.getEmail() + "}"
                    );
                    // TODO: update user details in Jira
                    diffData++;
                }
            }
        }

        // check JIRA users who are no more in LDAP and move them to inactive group
        int oldJiraUsers = 0;
        for ( RemoteUser jiraUser : jiraUsers.values() ) {
            if ( ! ldapUsers.containsKey(jiraUser.getName()) && !jiraInactiveUsers.containsKey(jiraUser.getName()) ) {
                LOG.info("Found old jira user " + jiraUser.getName() + " - moving him to 'inactive-staff' group");
                jiraRestClient.addUserToGroup(jiraUser, jiraInactiveStaff);
                oldJiraUsers++;
            }
        }

        // print stats
        long duration = System.currentTimeMillis() - start;
        LOG.info("Jira database synced with LDAP in " + (int)(duration/1000) + " s");
        LOG.info("Total number of new LDAP users is " + newLdapUsers);
        LOG.info("Total number of old Jira users is " + oldJiraUsers);
        LOG.info("Total number of 'rehired' Jira users is " + cntNoMoreInactiveJiraUsers);
        LOG.info("Total number of users with different data in Jira DB and LDAP is " + diffData);
    }


    public JiraRestClient getJiraRestClient() {
        return jiraRestClient;
    }
    public void setJiraRestClient(JiraRestClient jiraRestClient) {
        this.jiraRestClient = jiraRestClient;
    }
    public LdapClient getLdapClient() {
        return ldapClient;
    }
    public void setLdapClient(LdapClient ldapClient) {
        this.ldapClient = ldapClient;
    }
    public boolean isAddNewLdapUsersToJira() {
        return addNewLdapUsersToJira;
    }
    public void setAddNewLdapUsersToJira(boolean addNewLdapUsersToJira) {
        this.addNewLdapUsersToJira = addNewLdapUsersToJira;
    }


}
