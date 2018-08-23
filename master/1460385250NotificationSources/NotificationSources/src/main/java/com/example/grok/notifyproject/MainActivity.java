package com.example.grok.notifyproject;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.StyleSpan;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

public class MainActivity extends AppCompatActivity {
    Integer messageId =15;
    NotificationCompat.Builder mBuilder;
    NotificationManager mNotificationManager;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.e("notifyProject", "onCreate");
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        mNotificationManager= (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        createNotification(messageId);
        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {


                NotificationCompat.InboxStyle inboxStyle =
                        new NotificationCompat.InboxStyle();
                inboxStyle.setBigContentTitle("Message details:");
                Spannable[] events = new SpannableString[2];
                events[0]=new SpannableString("first message data for user");
                events[0].setSpan(new StyleSpan(android.graphics.Typeface.BOLD), 0, "first message".length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
                events[1]=new SpannableString("second message another data for user");
                events[1].setSpan(new StyleSpan(android.graphics.Typeface.BOLD), 0, "second message".length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

                for (int i=0; i < events.length; i++) {
                    inboxStyle.addLine(events[i]);
                }
                mBuilder.setStyle(inboxStyle);
                mBuilder.setContentTitle("extra info");
                mBuilder.setContentText("more messages received");
                mBuilder.setVisibility(NotificationCompat.VISIBILITY_SECRET);
                Notification fullNotif = mBuilder.build();
                fullNotif.ledARGB = Color.argb(255, 0, 255, 0);
                fullNotif.flags |= Notification.FLAG_SHOW_LIGHTS;
                fullNotif.ledOnMS = 200;
                fullNotif.ledOffMS = 300;

                mNotificationManager.notify(messageId, fullNotif);


            }
        });



    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
         int id = item.getItemId();

        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void createNotification(int mId) {
       mBuilder=
        new NotificationCompat.Builder(this)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle("Notification message")
                        .setContentText("Text for user")
                        .setAutoCancel(true)
                        .setCategory(NotificationCompat.CATEGORY_ALARM);
        Intent resultIntent = new Intent(this, NotificationReceiverActivity.class);
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);

        stackBuilder.addParentStack(NotificationReceiverActivity.class);
        stackBuilder.addNextIntent(resultIntent);
        PendingIntent resultPendingIntent =
                stackBuilder.getPendingIntent(
                        0,
                        PendingIntent.FLAG_UPDATE_CURRENT
                );
        mBuilder.setContentIntent(resultPendingIntent);
        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        mBuilder.addAction(R.mipmap.ic_launcher,"ActionButton",resultPendingIntent);
        mBuilder.setSound(soundUri);
        long [] pattern=new long[]{0, 100};
        mBuilder.setVibrate(pattern);
        mBuilder.setCategory(NotificationCompat.CATEGORY_SOCIAL);
        mNotificationManager.notify(messageId, mBuilder.build());
    }
}
