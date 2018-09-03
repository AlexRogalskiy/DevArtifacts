package net.codejava.ftp;

import java.io.IOException;

import org.apache.commons.net.ftp.FTPClient;

/**
 * This program demonstrates how to get and display reply messages from
 * a FTP server.
 * @author www.codejava.net
 *
 */
public class FTPGetServerReplyDemo {

	public static void main(String[] args) {
		String server = "www.myserver.com";
		int port = 21;
		String user = "username";
		String pass = "password";

		FTPClient ftpClient = new FTPClient();

		try {
			ftpClient.connect(server, port);
			System.out.println(ftpClient.getReplyString());

			ftpClient.login(user, pass);
			System.out.println(ftpClient.getReplyString());

			ftpClient.logout();
			System.out.println(ftpClient.getReplyString());

			ftpClient.disconnect();

		} catch (IOException ex) {
			ex.printStackTrace();
		} finally {
			if (ftpClient.isConnected()) {
				try {
					ftpClient.disconnect();
				} catch (IOException ex) {
					ex.printStackTrace();
				}
			}
		}
	}
}