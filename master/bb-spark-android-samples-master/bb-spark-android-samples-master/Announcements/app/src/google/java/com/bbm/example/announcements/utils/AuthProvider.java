/*
 * Copyright (c) 2017 BlackBerry.  All Rights Reserved.
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

package com.bbm.example.announcements.utils;


import android.content.Context;

import com.bbm.example.announcements.BuildConfig;
import com.bbm.example.announcements.R;
import com.bbm.sdk.support.identity.auth.GoogleAuthHelper;
import com.bbm.sdk.support.identity.user.FirebaseUserDbSync;
import com.bbm.sdk.support.kms.BlackBerryKMSSource;
import com.bbm.sdk.support.protect.FirebaseCloudKeySource;
import com.bbm.sdk.support.protect.KeySource;
import com.bbm.sdk.support.protect.UserChallengePasscodeProvider;
import com.bbm.sdk.support.util.IdentityUtils;
import com.bbm.sdk.support.util.KeySourceManager;

/**
 * Provides access to the GoogleAuth implementation.
 */
public class AuthProvider {
    /**
     * Initialize the GoogleAuthHelper with the application context, FirebaseUserDbSync and client id.
     * @param context android context
     */
    public static void initAuthProvider(Context context) {
        //Init google authentication provider
        GoogleAuthHelper.initGoogleSignIn(context, FirebaseUserDbSync.getInstance(), context.getString(R.string.default_web_client_id));
        //Init syncing users and FCM push token
        IdentityUtils.initUserDbSync(context, true);

        KeySource keySource;
        //If using KMS use the BlackBerryKMSSource, otherwise we will create a FirebaseCloudKeySource.
        if (BuildConfig.USE_KMS) {
            keySource = new BlackBerryKMSSource(new UserChallengePasscodeProvider(context));
        } else {
            //Initialize a FirebaseCloudKeySource
            keySource = new FirebaseCloudKeySource(context, new UserChallengePasscodeProvider(context));
        }

        KeySourceManager.setKeySource(keySource);
        keySource.start();
    }
}
