package org.jenkinsci.plugins.reststack;

import hudson.slaves.SlaveComputer;
import hudson.model.TaskListener;
import hudson.slaves.ComputerLauncher;

import hudson.plugins.sshslaves.SSHLauncher;

import java.io.IOException;

import java.util.logging.Logger;

public class RESTStackLauncher extends ComputerLauncher {
    private static final Logger LOGGER = Logger.getLogger(RESTStackLauncher.class.getName());

    public void launch(SlaveComputer computer, TaskListener listener) throws IOException, InterruptedException {
        final RESTStackSlave slave = (RESTStackSlave) computer.getNode();
        if (slave == null)
            throw new IOException("Could not launch NULL slave.");

        SSHLauncher launcher = new SSHLauncher(slave.getHost(), slave.getPort(), slave.getCredentialsId(), slave.getJvmOptions(), null, "", "", Integer.valueOf(0), null, null);
        launcher.launch(computer, listener);
    }
}
