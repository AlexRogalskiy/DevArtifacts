/*
 * FrameChannel.java February 2014
 *
 * Copyright (C) 2014, Niall Gallagher <niallg@users.sf.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */

package org.simpleframework.http.socket;

import java.io.IOException;

/**
 * The <code>FrameChannel</code> represents a full duplex communication
 * channel as defined by RFC 6455. Any instance of this will provide
 * a means to perform asynchronous writes and reads to a remote client
 * using a lightweight framing protocol. A frame is a finite length
 * sequence of bytes that can hold either text or binary data. Also,
 * control frames are used to perform heartbeat monitoring and closure. 
 * <p>
 * For convenience frames can be consumed from the socket via a
 * callback to a registered listener. This avoids having to poll each
 * socket for data and provides a asynchronous event driven model of
 * communication, which greatly reduces overhead and complication.
 * 
 * @author Niall Gallagher
 * 
 * @see org.simpleframework.http.socket.FrameListener
 * @see org.simpleframework.http.socket.Frame
 */
public interface FrameChannel {
   
   /**
    * This is used to send data to the connected client. To prevent
    * an application code from causing resource issues this will block
    * as soon as a configured linked list of mapped memory buffers has
    * been exhausted. Caution should be taken when writing a broadcast
    * implementation that can write to multiple sockets as a badly
    * behaving socket that has filled its output buffering capacity
    * can cause congestion.
    * 
    * @param data this is the data that is to be sent
    */
   void send(byte[] data) throws IOException;
   
   /**
    * This is used to send text to the connected client. To prevent
    * an application code from causing resource issues this will block
    * as soon as a configured linked list of mapped memory buffers has
    * been exhausted. Caution should be taken when writing a broadcast
    * implementation that can write to multiple sockets as a badly
    * behaving socket that has filled its output buffering capacity
    * can cause congestion.
    * 
    * @param text this is the text that is to be sent
    */
   void send(String text) throws IOException;
   
   /**
    * This is used to send data to the connected client. To prevent
    * an application code from causing resource issues this will block
    * as soon as a configured linked list of mapped memory buffers has
    * been exhausted. Caution should be taken when writing a broadcast
    * implementation that can write to multiple sockets as a badly
    * behaving socket that has filled its output buffering capacity
    * can cause congestion.
    * 
    * @param frame this is the frame that is to be sent
    */
   void send(Frame frame) throws IOException;
   
   /**
    * This is used to register a <code>FrameListener</code> to this
    * instance. The registered listener will receive all user frames
    * and control frames sent from the client. Also, when the frame
    * is closed or when an unexpected error occurs the listener is
    * notified. Any number of listeners can be registered at any time.
    * 
    * @param listener this is the listener that is to be registered
    */
   void register(FrameListener listener) throws IOException;
   
   /**
    * This is used to remove a <code>FrameListener</code> from this
    * instance. After removal the listener will no longer receive
    * any user frames or control messages from this specific instance.
    * 
    * @param listener this is the listener to be removed
    */
   void remove(FrameListener listener) throws IOException;
   
   /**
    * This is used to close the connection with a specific reason.
    * The close reason will be sent as a control frame before the
    * TCP connection is terminated.
    * 
    * @param reason the reason for closing the connection
    */
   void close(Reason reason) throws IOException;   
   
   /**
    * This is used to close the connection without a specific reason.
    * The close reason will be sent as a control frame before the
    * TCP connection is terminated.
    */
   void close() throws IOException;
}
