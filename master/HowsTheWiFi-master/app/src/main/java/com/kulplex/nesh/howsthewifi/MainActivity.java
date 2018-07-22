package com.kulplex.nesh.howsthewifi;

import android.os.AsyncTask;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class MainActivity extends AppCompatActivity {

    private TextView pingTextView;
    private TextView packetLossTextView;
    private TextView downloadTextView;
    private TextView uploadTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        pingTextView = findViewById(R.id.pingTextView);
        packetLossTextView = findViewById(R.id.packetLossTextView);
        downloadTextView = findViewById(R.id.downloadTextView);
        uploadTextView = findViewById(R.id.uploadTextView);
    }

    public void onCheckConnection(View view) {
        // Clear the textViews
        pingTextView.setText("-");
        packetLossTextView.setText("-");
        downloadTextView.setText("-");
        uploadTextView.setText("-");

        PingTask pingTask = new PingTask(5, 5);
        SpeedTestTask downloadTask = new SpeedTestTask(this, ReportType.DOWNLOAD, 8000);
        SpeedTestTask uploadTask = new SpeedTestTask(this, ReportType.UPLOAD, 8000);

        if (Build.VERSION.SDK_INT>=Build.VERSION_CODES.HONEYCOMB) {
            pingTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
            downloadTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
            uploadTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
        }
        else {
            pingTask.execute();
            downloadTask.execute();
            uploadTask.execute();
        }
    }

    public Integer[] getPing(String url, int amount, int maxDuration) {
        int delay = -1;
        int packetLoss = -1;

        try {
            java.lang.Process process = Runtime.getRuntime().exec(
                    "ping -w " + maxDuration + " -c " + amount + " " + url);
            BufferedReader reader = new BufferedReader(new InputStreamReader(
                    process.getInputStream()));
            int i;
            char[] buffer = new char[4096];
            StringBuffer output = new StringBuffer();
            while ((i = reader.read(buffer)) > 0) {
                output.append(buffer, 0, i);
            }
            reader.close();
            String op[] = output.toString().split("\n");
            for(int j=1; j<= amount; j++) {
                delay += Integer.parseInt(op[j].split("time=")[1].split(" ms")[0]);
            }
            packetLoss = Integer.parseInt(op[op.length-2].split("received, ")[1].split("%")[0]);
        } catch (Exception e) {
            return new Integer[]{delay/amount, packetLoss};
        }
        return new Integer[]{delay / amount, packetLoss};
    }

    private class PingTask extends AsyncTask<Integer, Void, Integer[]> {
        TextView pingTextView;
        int maxDuration;
        int amountPing;

        PingTask(int amountPing, int maxDuration) {
            pingTextView = findViewById(R.id.pingTextView);
            packetLossTextView = findViewById(R.id.packetLossTextView);
            this.maxDuration = maxDuration;
            this.amountPing = amountPing;
        }
        @Override
        protected Integer[] doInBackground(Integer... params) {
            return getPing("google.com", amountPing, maxDuration);
        }

        @Override
        protected void onPostExecute(Integer[] result) {
            if(result[0] >= 0){
                pingTextView.setText(result[0] + "ms");
            }
            else {
                pingTextView.setText("N/A");
            }

            if(result[1] >= 0){
                packetLossTextView.setText(result[1] + "%");
            }
            else {
                Log.e("xxxxxxxxxxxxxxxxxxx", "" + result[1]);
                packetLossTextView.setText("N/A");
            }
        }

        @Override
        protected void onPreExecute() {}
    }

    public void setDownloadText(String s) {
        downloadTextView.setText(s);
    }

    public void setUploadText(String s) {
        uploadTextView.setText(s);
    }
}
