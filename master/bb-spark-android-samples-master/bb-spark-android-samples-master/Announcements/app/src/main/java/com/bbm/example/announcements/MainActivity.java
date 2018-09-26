/*
 * Copyright (c) 2018 BlackBerry.  All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.bbm.example.announcements;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.bbm.sdk.BBMEnterprise;
import com.bbm.sdk.bbmds.BbmdsProtocol;
import com.bbm.sdk.bbmds.GlobalLocalUri;
import com.bbm.sdk.bbmds.GlobalSetupState;
import com.bbm.sdk.bbmds.User;
import com.bbm.sdk.bbmds.inbound.ChatStartFailed;
import com.bbm.sdk.bbmds.internal.Existence;
import com.bbm.sdk.bbmds.outbound.SetupRetry;
import com.bbm.sdk.reactive.ObservableValue;
import com.bbm.sdk.reactive.Observer;
import com.bbm.sdk.support.identity.user.AppUser;
import com.bbm.sdk.support.identity.user.UserManager;
import com.bbm.sdk.support.util.AuthIdentityHelper;
import com.bbm.sdk.support.util.ChatStartHelper;
import com.bbm.sdk.support.util.Logger;
import com.bbm.sdk.support.util.SetupHelper;

/**
 * The main activity for the Announcements app.
 */
public final class MainActivity extends AppCompatActivity {

    private ChatListFragment mChatListFragment;
    private ProgressBar mProgressView;
    private TextView mRegView;
    private TextView mDisplayName;

    // The local user
    private ObservableValue<User> mLocalUser;
    private ObservableValue<AppUser> mLocalAppUser;

    /**
     * Helper to get the local user from the BBM Enterprise SDK
     */
    private final Observer mRegistrationIdObserver = new Observer() {
        @Override
        public void changed() {
            BbmdsProtocol bbmdsProtocol = BBMEnterprise.getInstance().getBbmdsProtocol();
            //Get the uri of the local user first
            GlobalLocalUri localUserUri = bbmdsProtocol.getGlobalLocalUri().get();

            if (localUserUri.getExists() == Existence.YES) {
                //Get the local user and add ourselves as an observer

                if (mLocalUser != null) {
                    mLocalUser.removeObserver(mUserObserver);
                }
                mLocalUser = bbmdsProtocol.getUser(localUserUri.value);
                mLocalUser.addObserver(mUserObserver);
                mUserObserver.changed();
            }
        }
    };

    /**
     * Helper to set the registration ID field when a valid mLocalUser is
     */
    private final Observer mUserObserver = new Observer() {
        @Override
        public void changed() {
            if (mLocalUser.get().getExists() == Existence.YES && mRegView != null) {
                mRegView.setText(getString(R.string.my_registration_id, mLocalUser.get().regId));
            }
        }
    };

    /**
     * Helper to get the local users display name. This will be displayed
     * in the {@link MainActivity#mDisplayName}
     */
    private final Observer mLocalAppUserObserver = new Observer() {
        @Override
        public void changed() {
            String name = "";
            if (mLocalAppUser.get().getExists() == Existence.YES) {
                name = mLocalAppUser.get().getName();
            }

            if (mDisplayName != null) {
                mDisplayName.setText(name);
            }
        }
    };

    /**
     * Helper to transition between the BBM Enterprise SDK setup states.
     */
    private final Observer mBbmSetupObserver = new Observer() {
        @Override
        public void changed() {
            final ObservableValue<GlobalSetupState> globalSetupState = BBMEnterprise.getInstance().getBbmdsProtocol().getGlobalSetupState();

            if (globalSetupState.get().exists != Existence.YES) {
                return;
            }

            GlobalSetupState currentState = globalSetupState.get();

            switch (currentState.state) {
                case NotRequested:
                    SetupHelper.registerDevice("Announcements", "Announcements example");
                    break;
                case DeviceSwitchRequired:
                    //Automatically switch to this device.
                    BBMEnterprise.getInstance().getBbmdsProtocol().send(new SetupRetry());
                    break;
                case Full:
                    SetupHelper.handleFullState();
                    break;
                case Success:

                    // The user has been logged in, so hide the progress view and create the
                    // mChatListFragment if required.
                    if (mProgressView != null) {
                        // Hide the progress spinner
                        mProgressView.setVisibility(View.GONE);
                    }

                    // Create the chats fragment if missing.
                    if (mChatListFragment == null) {
                        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                        mChatListFragment = new ChatListFragment();
                        transaction.replace(R.id.fragmentContent, mChatListFragment, "main_frag");
                        transaction.commit();
                    }
                    break;
                case Ongoing:
                case Unspecified:
                    break;
            }
        }
    };


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Setup the view items
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        mRegView = findViewById(R.id.my_registration_id);
        mDisplayName = findViewById(R.id.my_display_name);
        mProgressView = findViewById(R.id.main_loading);

        if (savedInstanceState != null) {
            // Find the activity_main fragment. Will still be in the manager when device is rotated.
            mChatListFragment = (ChatListFragment) getSupportFragmentManager().findFragmentByTag("main_frag");

            if (mChatListFragment == null) {
                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                mChatListFragment = new ChatListFragment();
                transaction.replace(R.id.fragmentContent, mChatListFragment, "main_frag");
                transaction.commit();
            } else {
                mProgressView.setVisibility(View.GONE);
            }
        }


        // Hook up an action to the FloatingActionButton
        FloatingActionButton startCallFloatingButton = findViewById(R.id.fab);
        startCallFloatingButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showNewChatDialog();
            }
        });

        // Listen to the setup events
        final ObservableValue<GlobalSetupState> globalSetupState = BBMEnterprise.getInstance().getBbmdsProtocol().getGlobalSetupState();

        //Add setup observer to the globalSetupStateObservable
        globalSetupState.addObserver(mBbmSetupObserver);

        // Call changed to trigger our observer to run immediately
        mBbmSetupObserver.changed();

        // Set this activity in case it is needed to prompt the user to sign in with their Google account
        AuthIdentityHelper.setActivity(this);

        // Get the local users registration Id.
        BBMEnterprise.getInstance().getBbmdsProtocol().getGlobalLocalUri().addObserver(mRegistrationIdObserver);

        mLocalAppUser = UserManager.getInstance().getLocalAppUser();
        mLocalAppUser.addObserver(mLocalAppUserObserver);
    }

    @Override
    protected void onResume() {
        super.onResume();

        // Trigger an update to our helper Observers to update
        // the view.
        mRegistrationIdObserver.changed();
        mLocalAppUserObserver.changed();
    }

    /**
     * The authentication provider will send the results to this activity, this just passes to the helper to pass auth info to BBM SDK
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == AuthIdentityHelper.TOKEN_REQUEST_CODE) {
            //Handle an authentication result
            AuthIdentityHelper.handleAuthenticationResult(this, requestCode, resultCode, data);
        }
    }

    /**
     * Show a dialog to create a new chat
     */
    private void showNewChatDialog() {

        // Get the custom view to use in the alert dialog.
        final View contents = LayoutInflater.from(MainActivity.this).inflate(R.layout.dialog_chat_start, null);
        final EditText regIdText = contents.findViewById(R.id.reg_id);
        final EditText subjectText = contents.findViewById(R.id.subject);

        // Setup the alert dialog. On a positive button click a new chat should be started.
        AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this, R.style.AppTheme_dialog)
                .setTitle(R.string.start_chat)
                .setView(contents)
                .setPositiveButton(R.string.start, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        final Long regId = Long.valueOf(regIdText.getText().toString());
                        final String subject = subjectText.getText().toString();

                        ChatStartHelper.startNewChat(new long[]{regId}, subject, new ChatStartHelper.ChatStartedCallback() {
                            @Override
                            public void onChatStarted(@NonNull String chatId) {
                                //Start our chat activity
                                Intent intent = new Intent(MainActivity.this, ChatActivity.class);
                                intent.putExtra(ChatActivity.INTENT_EXTRA_CHAT_ID, chatId);
                                startActivity(intent);
                            }

                            @Override
                            public void onChatStartFailed(ChatStartFailed.Reason reason) {
                                Logger.i("Failed to create chat with " + regId);
                                Toast.makeText(MainActivity.this, "Failed to create chat for reason " + reason.toString(), Toast.LENGTH_LONG).show();
                            }
                        });

                    }
                });

        final AlertDialog dialog = builder.create();

        // Setup the text watchers to only enable the alert dialog positive button if the fields
        // as valid data. This needs to be setup on the regIdText and subjectText
        final TextWatcher watcher = new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (TextUtils.isEmpty(regIdText.getText().toString().trim()) ||
                        TextUtils.isEmpty(subjectText.getText().toString().trim())) {
                    dialog.getButton(DialogInterface.BUTTON_POSITIVE).setEnabled(false);
                } else {
                    dialog.getButton(DialogInterface.BUTTON_POSITIVE).setEnabled(true);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        };

        regIdText.addTextChangedListener(watcher);
        subjectText.addTextChangedListener(watcher);

        // Finally show the dialog and do some initial adjustments.
        dialog.show();
        dialog.getButton(DialogInterface.BUTTON_POSITIVE).setEnabled(false);
        Helper.resizeAlertDialog(dialog);
    }
}
