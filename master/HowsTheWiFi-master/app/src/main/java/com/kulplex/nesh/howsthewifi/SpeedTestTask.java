package com.kulplex.nesh.howsthewifi;

import android.os.AsyncTask;

import fr.bmartel.speedtest.SpeedTestReport;
import fr.bmartel.speedtest.SpeedTestSocket;
import fr.bmartel.speedtest.inter.ISpeedTestListener;
import fr.bmartel.speedtest.model.SpeedTestError;

public class SpeedTestTask extends AsyncTask<SpeedTestReport, SpeedTestReport, SpeedTestReport> {

    private MainActivity mainActivity;
    private ReportType reportType;
    private int maxDuration;

    public SpeedTestTask(MainActivity mainActivity, ReportType rt, int maxDuration) {
        reportType = rt;
        this.mainActivity = mainActivity;
        this.maxDuration = maxDuration;
    }

    @Override
    protected SpeedTestReport doInBackground(SpeedTestReport... params) {

        SpeedTestSocket speedTestSocket = new SpeedTestSocket();

        // add a listener to wait for speedtest completion and progress
        speedTestSocket.addSpeedTestListener(new ISpeedTestListener() {

            @Override
            public void onCompletion(SpeedTestReport report) {

            }

            @Override
            public void onError(SpeedTestError speedTestError, String errorMessage) {
                // called when a download/upload error occur
            }

            @Override
            public void onProgress(float percent, SpeedTestReport report) {
                // called to notify download/upload progress
                publishProgress(report);
            }
        });

        if(reportType == ReportType.DOWNLOAD) {
            speedTestSocket.setDownloadSetupTime(1000);
            speedTestSocket.startFixedDownload("http://2.testdebit.info/fichiers/100Mo.dat", maxDuration);
        } else {
            speedTestSocket.setUploadSetupTime(1000);
            speedTestSocket.startFixedUpload("http://2.testdebit.info/", 100000000, maxDuration);
        }

        return null;
    }

    @Override
    protected void onPostExecute(SpeedTestReport report) {

    }

    @Override
    protected void onProgressUpdate(SpeedTestReport... reports) {
        String reportText = round(reports[0].getTransferRateBit().floatValue() * 0.001f, 1) + "Kb/s";
        if(reportType == ReportType.DOWNLOAD) {
            mainActivity.setDownloadText(reportText);
        } else {
            mainActivity.setUploadText(reportText);
        }
    }

    protected float round(float value, int precision) {
        float prec = 10 * precision;
        return (int)(value * prec) / (prec);
    }
}