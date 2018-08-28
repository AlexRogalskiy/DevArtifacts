package it.polimi.deib.p2pchat.discovery;
/*
 * Copyright (C) 2015-2016 Stefano Cappa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Class to configure some important attribute.
 * <p></p>
 * Created by Stefano Cappa on 17/02/15.
 */
public class Configuration {

    //attention, to remove debug's messages in wifichatfragment, set this to "false"!!!!
    public static final boolean DEBUG_VERSION = true;

    public static final int GROUPOWNER_PORT = 4545;
    public static final int CLIENT_PORT = 5000;
    public static final int THREAD_COUNT = 20; //maximum number of clients that this GO can manage
    public static final int THREAD_POOL_EXECUTOR_KEEP_ALIVE_TIME = 10; //don't touch this!!!

    public static final String TXTRECORD_PROP_AVAILABLE = "available";
    public static final String SERVICE_INSTANCE = "polimip2p";
    public static final String SERVICE_REG_TYPE = "_presence._tcp";

    public static final int MESSAGE_READ = 0x400 + 1;
    public static final int FIRSTMESSAGEXCHANGE = 0x400 + 2;

    public static final String MESSAGE_READ_MSG = "MESSAGE_READ";
    public static final String FIRSTMESSAGEXCHANGE_MSG = "FIRSTMESSAGEXCHANGE";

    public static final String MAGICADDRESSKEYWORD = "4<D<D<R<3<5<5";
    public static final String PLUSSYMBOLS = "++++++++++++++++++++++++++";
}
