package net.codejava.ftp;

import java.io.IOException;

import org.apache.commons.net.ftp.FTPClient;

/**
 * This program demonstrates how to query for extensions (features)
 * supported by the currently connected FTP server.
 * @author www.codejava.net
 *
 */
public class FTPServerFeaturesDemo {

	public static void main(String[] args) {
		String server = "www.myserver.com";
		int port = 21;

		FTPClient ftpClient = new FTPClient();

		try {
			ftpClient.connect(server, port);

			boolean success = ftpClient.features();
			if (success) {
				System.out.println(ftpClient.getReplyString());
			} else {
				System.out.println("Could not query server features");
			}

			success = ftpClient.hasFeature("SIZE");

			if (success) {
				System.out.println("The server supports SIZE feature.");
			} else {
				System.out.println("The server does not support SIZE feature.");
			}

			String featureValue = ftpClient.featureValue("AUTH");
			if (featureValue == null) {
				System.out.println("The server does not support this feature.");
			} else {
				System.out.println("Value of AUTH feature: " + featureValue);
			}

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